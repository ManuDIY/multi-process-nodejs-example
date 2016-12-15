'use strict'

const fs        = require('fs')
const promisify = require('es6-promisify')
const uuid      = require('uuid')

const readFile    = promisify(fs.readFile)
const processType = process.env.PROCESS_TYPE

function * version () {
  // TODO: check process.cwd in a container!!!
  const { version, build } = yield readFile(`${process.cwd()}/package.json`)

  const name  = process.env.UUID
                  ? `${processType}@${process.env.UUID}`
                  : `${processType}@${uuid()}`

  this.body = {
    name,
    version,
    build
  }
}

module.exports = version
