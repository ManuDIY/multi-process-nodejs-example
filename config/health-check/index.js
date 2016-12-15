/* eslint-disable global-require, import/no-dynamic-require */

'use strict'

const processType = process.env.PROCESS_TYPE

let config
try {
  if (!processType) throw new Error('No process type!')

  if (processType !== 'web') {
    config = require('./server')
  } else if (processType === 'web') {
    config = require('./router')
  } else {
    throw new Error(`No health-check config for for process type: ${processType}`)
  }
} catch (ex) {
  throw new Error(`Error for health-check config for process type: ${processType}`, ex)
}

module.exports = config
