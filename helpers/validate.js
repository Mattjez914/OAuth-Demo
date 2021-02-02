exports.required = (string, paramName='Not specified') => {
    if (!string) {
        throw {message: `Request missing required parameter: ${paramName}`, code: 400}
    }
    else return string
}