'use strict'

const db = require('../')
const utils = require('iot-utils')
const config = utils.db.config_db(false)
const handleFatalError = utils.errors.handleFatalError


async function run () {
  const { Agent, Metric } = await db(config).catch(handleFatalError)

  const agent = await Agent.createOrUpdate({
    uuid: 'zzzz',
    name: 'test',
    username: 'test',
    hostname: 'test',
    pid: 1,
    connected: true
  }).catch(handleFatalError)

  console.group('--create--')
  console.log(agent)
  console.groupEnd()

  const agents = await Agent.findAll().catch(handleFatalError)

  console.group('--findAll--')
  console.log(agents)
  console.groupEnd()

  const metric = await Metric.create(agent.uuid, {
    type: 'memory',
    value: '300'
  }).catch(handleFatalError)

  console.group('--createMetric--')
  console.log(metric)
  console.groupEnd()

  const metricsByAgent = await Metric.findByAgentUuid(agent.uuid).catch(handleFatalError)

  console.group('--type of metric for agent--')
  console.log(metricsByAgent)
  console.groupEnd()

  const metricsByType = await Metric.findByTypeAgentUuid('memory', agent.uuid)

  console.group('-- metrics for type and agent')
  console.log(metricsByType)
  console.groupEnd()
}

run()
