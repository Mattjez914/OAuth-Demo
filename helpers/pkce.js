const crypto = require('crypto')

// Creates SHA256 hash of input string
const sha256 = (string) => {
    let encoder = new TextEncoder()
    let data = encoder.encode(string)
    return window.crypto.subtle.digest('SHA-256', data)
}

// Bas64-url encodes input string
const base64urlencode = (string) => {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Generates random string with browser crpyto functions
exports.generateRandomString = () =>{
    let array = new Uint32Array(28)
    window.crypto.getRandomValues(array)
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('')
}

exports.pkceChallengeFromVerifier = async (verifier) => {
    let hashed = await sha256(verifier)
    return base64urlencode(hashed)
}

exports.pkceNode = (verifier) => {
    let hash = crypto.createHash('sha256').update(verifier).digest('base64')
    return hash
}