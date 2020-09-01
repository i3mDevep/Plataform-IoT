'use strict'

async function findAllAgents (Service) {
  return await Service.findAll()
}

async function findAllAgentByUuid (Service, uuid) {
  return await Service.findByUuid(uuid)
}
module.exports = { findAllAgents, findAllAgentByUuid }
