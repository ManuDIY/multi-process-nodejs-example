'use strict'

const Router = require('koa-router')
const health = require('./handler')

const router  = new Router()

router.get('/health', health)

module.exports = router
