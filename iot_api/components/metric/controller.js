'use strict'

async function findMetricByUuid (Service, uuid) {
  return await Service.findByAgentUuid(uuid)
}

async function findMetricByUuidAndType (Service, uuid, type) {
  return await Service.findByTypeAgentUuid(type, uuid)
}
module.exports = { findMetricByUuid, findMetricByUuidAndType }
