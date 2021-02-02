const jwt = require('jsonwebtoken')
const token = require('../helpers/tokens')
const validate = require('../helpers/validate')

exports.internal = function internal(req, res, next) {
  try {
    const localhost = '::1' // ipv6 localhost address
    const localhost2 = '::ffff:127.0.0.1' // ipv6 to ipv4 localhost address
    const whitelist = [localhost, localhost2] // list of internal ip's allowed
    if (whitelist.includes(req.ip)) {
      next()
    } else {
      console.log('ip not whitelisted:', req.ip)
      res.status(401).send()
    }
  } catch (error) {
    console.log('error:', error)
    res.status(401).send()
  }
}

exports.basicAuth = (req, res, next) => {
  // check for basic auth header
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
      return res.status(401).json({ message: 'Missing Authorization Header' })
  }

  // verify auth credentials
  const base64Credentials =  req.headers.authorization.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  const [username, password] = credentials.split(':')
  req.username = username
  req.password = password
  next()
}

exports.pkceClientAuth = async (req, res, next) => {
  try {
    let clientId = validate.required(req.query.client_id, 'client_id')
    let redirectUri = validate.required(req.query.redirect_uri, 'redirect_uri')
    let clientCheck = true
    // check clientId against db, ensure redirect uri matches in db as well
    if (!clientCheck) return res.status(400).send() //  need to add error message regarding invalid clientId or redirect uri

    next()

  } catch (err) {
    return res.status(err.code).send({error: err.message})
  }
}

exports.verify = function (req, res, next) {
  const authHeader = req.header('Authorization')
  if (!authHeader) {
    console.log('missing auth header')
    res.status(401).send()
  } else {
    const bearer = authHeader.split(' ')
    if (bearer.length !== 2 || bearer[0] !== 'Bearer') {
      console.log('invalid bearer token')
      res.status(401).send()
    } else {
      const bearerToken = bearer[1]
      let decodedToken
      try {
        decodedToken = token.verifyToken(bearerToken)
      } catch (err) {
        console.log('token error catch')
        console.log('jwt error:', err.name, err.message)
        if (err.name == 'JsonWebTokenError') return res.status(403).send() // checks if token is invalid
        if (err.name =='TokenExpiredError') return res.status(401).send() // checks if token is expired
        return res.status(400).send()
      }
      if (!decodedToken) {
        console.log('token not valid')
        return res.status(403).send()
      }
      req.userId = decodedToken.userId
      req.isAuth = true
      next()
    }
  }
}