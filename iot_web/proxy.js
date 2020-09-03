const express = require('express')
const axios = require('axios')

const api = express.Router()

api.get('/agents', async (req, res) => {
  const response = await axios.get('http://localhost:3000/api/agent')
  res.send(response.data)
})

api.get('/metrics/:uuid', async (req, res) => {
  const { uuid } = req.params
  try {
    const response = await axios.get(`http://localhost:3000/api/metric/${uuid}`)
    res.send(response.data)
  } catch (error) {
    res.status(404).send(error.response.data)
  }
})

api.get('/metrics/:uuid/:type', async (req, res) => {
  const { uuid, type } = req.params
  try {
    const response = await axios.get(`http://localhost:3000/api/metric/${uuid}/${type}`)
    res.send(response.data)
  } catch (error) {
    res.status(404).send(error.response.data)
  }
})

module.exports = api
