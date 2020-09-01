'use strict'

const chalk = require('chalk')
const utils = require('iot-utils')
const express = require('express')
const routes = require('./api/middleware')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

routes(app)

process.on('uncaughtException', utils.errors.handleFatalError)
process.on('unhandledRejection', utils.errors.handleFatalError)

app.listen(port, () => {
  console.log(`${chalk.green('[IoT-api]')} server listening on port ${port}`)
})
