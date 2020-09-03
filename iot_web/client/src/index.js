import ReactDOM from 'react-dom'
import React, { useEffect, useState } from 'react'
import socketIOClient from 'socket.io-client'
import ListAgentComponent from './components/ListAgentsComponent'
import axios from 'axios'


const ENDPOINT = 'http://localhost:8080'

function App () {
  const [dataRealTimeMessage, setDataRealTimeMessage] = useState({})
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT)
    socket.on('agent/message', data => {
      console.log('agent/message: ', data)
      setDataRealTimeMessage(data)
    })
    socket.on('agent/connected', data => {
      console.log('agent/connected: ', data)
    })
    socket.on('agent/disconnected', data => {
      console.log('agent/disconnected: ', data)
    })
  }, [])

  const [agents, setAgents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('http://localhost:8080/api/agents')
      if (!result.data.error.status) {
        setAgents(result.data.body)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <section className='hero is-info'>
        <div className='hero-body'>
          <div className='container'>
            <h1 className='title'>Plataform MQTT</h1>
            <p className='subtitle'>Visualize your data</p>
          </div>
        </div>
      </section>
      <ListAgentComponent agents={agents} messages={dataRealTimeMessage} />

    </>
  )
}
ReactDOM.render(<App />, document.getElementById('app'))
