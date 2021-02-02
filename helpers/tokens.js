const jwt = require('jsonwebtoken')

exports.createToken = (payload = {} , expiration = null) => {
    let options = {}

    if (expiration) {
        options.expiresIn = expiration
        console.log('Added expiration', expiration)
    }

    return jwt.sign(payload, process.env.TOKEN_SECRET, options)
}

exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.TOKEN_SECRET)
}

exports.generateTokenResponse = (accessToken,refreshToken, expiration) => {
    return { access_token: accessToken, refresh_token: refreshToken, token_type: "bearer", expires: expiration }
}