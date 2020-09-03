'use strict'

const debug = require('debug')('IoT:web')
const chalk = require('chalk')
const express = require('express')
const socket = require('socket.io')
const proxy = require('./proxy')
const path = require('path')
const utils = require('iot-utils')
const IotAgent = require('iot_agent')
const cors = require('cors')

const agent = new IotAgent()
const app = express()

const port = 8080 || process.env.PORT_WEB

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use(cors())

app.use(express.static(path.join(__dirname, 'client/dist')))
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
