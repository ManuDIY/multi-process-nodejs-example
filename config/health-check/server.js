'use strict'

const http      = require('http')
const koa       = require('koa')
const promisify = require('es6-promisify')
const logger    = require('winston')
const joi       = require('joi')
const router    = require('./router')

const envVarsSchema = joi.object({
  HEALTH_PORT: joi.number().required()
}).unknown().required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

// creating web server
const app = koa()

app.use(router.middleware())

const server = http.createServer(app.callback())
const serverListen = promisify(server.listen, server)

// graceful shutdown
process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      logger.error('Error happened during server close', err)
      process.exit(1)
    }
    process.exit(0)
  })
})

// start web server for health check
function healthCheck () {
  return serverListen(envVars.port)
    .then(() => logger.info(`App is listening on port ${envVars.port}`))
    .catch((err) => {
      logger.error('Error happened during server start', err)
      process.exit(1)
    })
}



module.exports = healthCheck
