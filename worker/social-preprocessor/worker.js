'use strict'

const trace = require('@risingstack/trace')
const joi = require('joi')
const logger = require('winston')
const config = require('../../config')
const tortoise = require('../../models/tortoise')
const redis = require('../../models/redis')

const messageSchema = joi.object({
  createdAt: joi.date()
    .required(),
  text: joi.string()
    .required(),
  tweeter: joi.string()
    .required()
})
.required()

const queue = tortoise
  .queue(tortoise.QUEUE.tweet)
  .prefetch(1)
  .json()
  .subscribe((msg, ack, nack) => {
    const { error, value } = joi.validate(msg, messageSchema)

    if (error) {
      logger.warn('Social preprocessor invalid message', { msg, error: error.message })
      ack()
      return
    }

    redis.zadd(redis.SET.tweets, value.createdAt.getTime(), JSON.stringify(msg))
      .then(() => {
        logger.debug('Social preprocessor save success', { msg })
        trace.incrementMetric('tweets/saved')
        ack()
      })
      .catch((err) => {
        logger.error('Social preprocessor save error', { error: err })
        nack()
      })
  })

setInterval(() => {
  redis.zremrangebyscore(redis.SET.tweets, 0, Date.now() - config.redis.dataRetention)
}, 60 * 1000)

process.on('SIGTERM', () => {
  try {
    queue.then((ch) => {
      logger.debug('closing channel')
      // This will only be called once the original channel closes, not for any new channels created
      ch.on('close', () => {
        logger.debug('channel closed')
      })
    })
  } catch (err) {
    logger.error('Error happened during stream destroy', err)
    process.exit(1)
  }

  try {
    logger.debug('closing redis')
    redis.disconnect()
    logger.debug('redis closed')
  } catch (err) {
    logger.error('Error happened during redis disconnect', err)
    process.exit(1)
  }

  process.exit(0)
})
