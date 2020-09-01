const express = require('express')
const response = require('../../api/response')
const { findMetricByUuid, findMetricByUuidAndType } = require('./controller')
const api = express.Router()

api.get('/:uuid', async (req, res) => {
  const { uuid } = req.params
  let metrics = []
  try {
    metrics = await findMetricByUuid(req.Metric, uuid)
    if (!metrics || metrics.length === 0) {
      return handleError(req, res, `Metrics not found for agent with uuid ${uuid}`, 404)
    }
  } catch (error) {
    handleError(req, res, error)
  }
  response.success(req, res, metrics)
})

api.get('/:uuid/:type', async (req, res) => {
  const { uuid, type } = req.params
  let metrics = []
  try {
    metrics = await findMetricByUuidAndType(req.Metric, uuid, type)
    if (!metrics || metrics.length === 0) {
      return handleError(req, res, `Metrics (${type}) not found for agent with uuid ${uuid}`, 404)
    }
  } catch (error) {
    handleError(req, res, error)
  }
  response.success(req, res, metrics)
})

function handleError (req, res, e, status) {
  console.error(`error controlladed ${e}`)
  response.error(req, res, e, status)
}

module.exports = api
