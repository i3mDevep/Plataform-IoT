'use strict'

const setupDatabase = require('./lib/db')
const setupAgentService = require('./lib/agentService')
const setupMetricService = require('./lib/metricService')

const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')

const defaults = require('defaults')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequelize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const Agent = setupAgentService(AgentModel)
  const Metric = setupMetricService(MetricModel, AgentModel)

  return {
    Agent,
    Metric
  }
}
