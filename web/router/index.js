'use strict'

const config  = require('../../config/')
const api     = require('./api')
// const version = require('./version')

const { router } = config

// endpoints
router.get('/api/v1/tweets', api.tweets.get)

module.exports = router
