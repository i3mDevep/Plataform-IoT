const express = require('express')
const axios = require('axios')

const api = express.Router()

api.get('/agents', async (req, res) => {
  const response = await axios.get('http://localhost:3000/api/agent')
  res.send(response.data)
})

module.exports = api
