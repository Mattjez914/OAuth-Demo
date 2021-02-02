const initializePublicEndpoints = (app) => {
  const routesApi = require('./routes/api')
  app.use('/api', routesApi)
}

module.exports = initializePublicEndpoints;