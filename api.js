const express = require('express')
const router = express.Router()
const Joi = require('@hapi/joi')
const token = require('../helpers/tokens')
const userBase = require('../helpers/userBase')
const packageJson = require('../package.json')
const auth = require('../middleware/auth')
const validate = require('../helpers/validate')

const appVersion = packageJson.version

const accessExpiration = 600

// /api/version
router.get('/version', async (req, res) => {
  res.header('Cache-Control', 'public, max-age=1200').status(200).send({ version: appVersion })
})

// /api/createToken - get new token and add to response
router.get('/createToken', async (req, res) => { 
  let accessToken = token.createToken({userId: '1M2jfd4'}, 40)
  let decodedToken = token.verifyToken(accessToken)
  console.log(decodedToken)
  let sendValue =  { Authorization: `Bearer ${accessToken}`, Decoded: decodedToken }
  res.header('Cache-Control', 'private, max-age=120').header('Authorization', `Bearer ${accessToken}`).status(200).send(sendValue)
})

// /api/login - takes user credentials and adds an access and refresh token to response if valid
router.post('/login', auth.basicAuth, async (req, res) => { 
  console.log(req.body);
  let username = req.username
  let password = req.password
  try {
    let userId = await userBase.login(username,password)
    let accessToken = token.createToken({userId}, accessExpiration)
    let refreshToken = token.createToken({userId}, 3600)
    let decodedToken = token.verifyToken(accessToken)
    console.log(decodedToken)
    let sendValue =  token.generateTokenResponse(accessToken,refreshToken,accessExpiration);
    res.header('Cache-Control', 'private, max-age=120').header('Authorization', `Bearer ${accessToken}`).status(200).send(sendValue)
  }
  catch (err) {
    console.log(err)
    res.status(401).json({message: err.message});
  }
})

// /api/refreshToken - checks for refresh token and generates new access token if valid
router.post('/refreshToken', async (req, res) => { 
  let decodedToken
  let refreshToken = req.body.refreshToken
  try {
    decodedToken = token.verifyToken(refreshToken)
  } catch (err) {
    console.log('token error catch')
    console.log('jwt error:', err.name, err.message)
    if (err.name !=='TokenExpiredError') return res.status(403).send() // checks if token is expired
    return res.status(401).send()
  }
  if (!decodedToken) {
    console.log('token not valid')
    return res.status(403).send()
  }
  let userId = decodedToken.userId
  let accessToken = token.createToken({userId}, accessExpiration)
  let sendValue = token.generateTokenResponse(accessToken,refreshToken,accessExpiration);
  res.header('Cache-Control', 'private, max-age=120').header('Authorization', `Bearer ${accessToken}`).status(200).send(sendValue)
})


// /api/tokenTest - checks access token and returns user id if successful
router.get('/tokenTest', auth.verify, async (req, res) => { 
  let userId = req.userId
  let isAuth = req.isAuth
  console.log(userId)
  console.log(isAuth)
  if(!isAuth) res.status(401).send()
  res.status(200).send({userId})
})

// /api/loginPKCE - starts auth code flow cycle
router.get('/loginPKCE', auth.pkceClientAuth, async (req, res) => { 
  console.log(req.query);
  let username = req.username
  let password = req.password
  try {
    let responseType = validate.required(req.query.response_type, 'response_type')
    let state = validate.required(req.query.state, 'state')
    let codeChallenge = validate.required(req.query.code_challenge, 'code_challenge')
    let method = validate.required(req.query.code_challenge_method, 'code_challenge_method')
    let scope = req.query.scope
    let redirectUri = req.query.redirect_uri

    // generate auth code
    let code
    // if needed, authenticate user
    // redirect client with state and code in query parameters
    res.redirect(`${redirectUri}?state=${state}&code=${code}`)
  }
  catch (err) {
    console.log(err)
    res.status(err.code).json({message: err.message});
  }
})

module.exports = router
