'use strict'

const debug = require('debug')('iot:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const chalk = require('chalk')
const db = require('iot_db')
const utils = require('iot-utils')
const config = utils.db.config_db(false)
const handleFatalError = utils.errors.handleFatalError

let Agent, Metric

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}
const settings = {
  port: 1883,
  backend
}

const server = new mosca.Server(settings)
const clients = new Map()

server.on('clientConnected', client => {
  clients.set(client.id, null)
  debug(`Client Connect: ${client.id}`)
})

server.on('clientDisconnected', async client => {
  debug(`Client Disconnect: ${client.id}`)
  const agent = clients.get(client.id)

  if(agent){
    // Mark as Disconnected //
    agent.connected = false

    try {
      await Agent.createOrUpdate(agent)
    } catch(e){
      return console.error(e)
    }
    //Delete Agent from Clients list //
    clients.delete(client.id)

    // Notification to all clients - this agent was disconnected //
    server.publish({
      topic: 'agent/disconnected',
      payload: {
        agent:{
          uuid: agent.uuid
        }
      }
    })
    debug(`Client (${client.id} associated to agent (${agent.uuid}) marked as disconnected`)
  }
})

server.on('published', async (packet, client) => {
  debug(`Received: ${packet.topic}`)
  switch (packet.topic) {
    case 'agent/connected':
    case 'agent/disconnected':
      debug(`Payload: ${packet.payload}`)
      break
    case 'agent/message':
      const payload = utils.mqtt.parsePayload(packet.payload)

      if (payload) {
        payload.agent.connected = true
        let agent
        try {
          agent = await Agent.createOrUpdate(payload.agent)
        } catch (e) {
          return console.error(e.message)
        }
        debug(`Agent ${agent} saved!`)

        // Notify Agent is Connected //
        if (!clients.get(client.uuid)) {
          clients.set(client.id, agent)
          server.publish({
            topic: 'agent/connected',
            payload: JSON.stringify({
              agent: {
                uuid: agent.uuid,
                name: agent.name,
                hostname: agent.hostname,
                pid: agent.pid,
                connected: agent.connected
              }
            })
          })
        }

        // Store metrics //
        Promise.all(payload.metrics.map( async metric => await Metric.create(agent.uuid, metric) )).catch((e)=>console.error(e))
      }
      break
  }
  debug(`Payload: ${packet.payload}`)
})

server.on('ready', async () => {
  const service = await db(config).catch(handleFatalError)
  Agent = service.Agent
  Metric = service.Metric
  console.log(`${chalk.green('[ito-mqtt]')} server is running`)
})

server.on('error', handleFatalError)

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)


/* mqtt pub -t "agent/message" -m "{\"agent\": {\"uuid\": \"yyy\", \"name\": \"platzi\", \"username\": \"platzi\", \"pid\": 10, \"hostname\": \"platzibogota\"}, \"metrics\": [{\"type\": \"memory\", \"value\": \"1001\"}, {\"type\": \"temp\", \"value\": \"33\"}]}" */