'use strict'

const debug = require('debug')('IoT:web')
const chalk = require('chalk')
const express = require('express')
const socket = require('socket.io')
const proxy = require('./proxy')
const path = require('path')
const utils = require('iot-utils')
const IotAgent = require('iot_agent')

const agent = new IotAgent()
const app = express()

const port = 8080 || process.env.PORT_WEB

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'YOUR-DOMAIN.TLD') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(express.static(path.join(__dirname, 'client/dist'), {
  etag: false
}))
app.use('/api', proxy)

process.on('uncaughtException', utils.errors.handleFatalError)
process.on('unhandledRejection', utils.errors.handleFatalError)

const server = app.listen(port, () => {
  console.log(`${chalk.green('[IoT-web]')} server listening in port ${port}`)
  agent.connect()
})

const io = socket(server)

io.on('connection', socket => {
  debug(`client conneted with id ${socket.id}`)
  utils.event.pipe(agent, socket)

  socket.on('disconnect', () => {
    debug(`client disconneted with id ${socket.id}`)
  })
})
