'use strict'

const db = require('iot_db')
const utils = require('iot-utils')

const agent = require('../components/agent/network')
const metric = require('../components/metric/network')

let service, Agent, Metric

function routes (app) {
  app.use('*', async (req, res, next) => {
    if (!service) {
      try {
        const config = utils.db.config_db()
        service = await db(config)
      } catch (error) {
        utils.errors.handleFatalError(error)
      }
    }
    Agent = service.Agent
    Metric = service.Metric

    req.Agent = Agent
    req.Metric = Metric

    next()
  })
  app.use('/api/agent', agent)
  app.use('/api/metric', metric)
}

module.exports = routes
