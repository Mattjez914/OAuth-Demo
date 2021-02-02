// load libraries
const express = require('express') // for api library
const winston = require('winston') // for logging
require('winston-daily-rotate-file') // required for rotating log files
const expressWinston = require('express-winston') // for request/error logging
const helmet = require('helmet') // for http security
const http = require('http') // for http library
const path = require('path') // for accessing directories and files
const cors = require('cors') // for cross site scripting

// configure logging
const customTransport = new winston.transports.DailyRotateFile({
  datePattern: 'YYYYMMDD',
  zippedArchive: true,
  filename: 'app_%DATE%.log',
  dirname: `${path.dirname(require.main.filename)}/log`,
  maxSize: '20m',
  maxFiles: '14d'
})
customTransport.on('rotate', (oldFilename, newFilename) => {
  console.log(`Log file changed from ${oldFilename} to ${newFilename}.`)
})

const logger = expressWinston.logger({
  transports: [customTransport],
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  headerBlacklist: 'authorization' // to hide bearer from log
})

// use the following libraries
const app = express() // app router
app.use(helmet()) // http security
app.use(logger) // logging
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // process body to json
app.use(express.static('static')) // folder for static html files

const corsEnabled = true
if (corsEnabled) {
  app.use(cors())
}

// include public endpoints
const endpoints = require('./endpoints')
endpoints(app)

// application init
const packageJson = require('./package.json')
const appName = packageJson.name.toUpperCase()
const appVersion = packageJson.version
const appDescription = packageJson.description

require('dotenv').config({ silent: true })

try {
  const port = process.env.SERVER_PORT || false
  const env = process.env.NODE_ENV || false
  const token = process.env.TOKEN_SECRET || false
  const mls = process.env.MSSQL_MLS_CONFIG || false
  const hasRequired = port && env && token && mls
  //console.log('envs:', port, env, token, zone, mls)

  console.info(`\n[${env}]`)
  console.info(`${appName} v${appVersion} by Realty ONE Group`)
  if (!hasRequired) {
    throw new Error('There was a problem with the environment missing variables.')
  }
  console.info(`${appDescription}\n`)
} catch {
  throw new Error('There was an error with the environment variables.')
}

// start api app responding to http
const httpServer = http.createServer(app)
const httpPort = process.env.SERVER_PORT
const message = (corsEnabled ? `CORS-enabled server` : `Server`) + ` listening for HTTP Requests on port ${httpPort}\n`
httpServer.listen(httpPort, () => console.log(message))

module.exports = httpServer;