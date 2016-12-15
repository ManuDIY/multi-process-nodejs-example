'use strict'

const common = require('./components/common')
const logger = require('./components/logger')
const rabbitmq = require('./components/rabbitmq')
const twitter = require('./components/twitter')
const healthCheck = require('./health-check/')

module.exports = Object.assign({}, common, logger, rabbitmq, twitter, { healthCheck: healthCheck() })
