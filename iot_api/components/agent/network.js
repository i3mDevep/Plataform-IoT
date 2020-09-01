'use strict'

const { findAllAgents, findAllAgentByUuid } = require('./controller')
const express = require('express')
const response = require('../../api/response')
const api = express.Router()

api.get('/', async (req, res) => {
  try {
    const agents = await findAllAgents(req.Agent)
    response.success(req, res, agents)
  } catch (error) {
    handleError(req, res, error)
  }
})

api.get('/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params
    const agent = await findAllAgentByUuid(req.Agent, uuid)
    if (!agent) {
      return handleError(req, res, `Agent not found with uuid ${uuid}`, 404)
    }
    response.success(req, res, agent)
  } catch (error) {
    handleError(req, res, error)
  }
})

function handleError (req, res, e, status) {
  console.error(`error controlladed ${e}`)
  response.error(req, res, e, status)
}

module.exports = api
