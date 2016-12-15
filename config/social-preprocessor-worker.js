'use strict'

const common      = require('./components/common')
const logger      = require('./components/logger')
const rabbitmq    = require('./components/rabbitmq')
const redis       = require('./components/redis')
const healthCheck = require('./health-check/')

module.exports = Object.assign({}, common, logger, rabbitmq, redis, { healthCheck: healthCheck() })
