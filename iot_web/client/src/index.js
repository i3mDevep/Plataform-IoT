import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'
const ENDPOINT = 'http://localhost:8080'

function App () {
  const [response, setResponse] = useState('')

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT)
    socket.on('agent/message', data => {
      console.log(data)
    })
    socket.on('agent/connected', data => {
      console.log(data)
    })
    socket.on('agent/disconnected', data => {
      console.log(data)
    })
  }, [])

  return (
    <h1>
      It's <time dateTime={response}>{response}</time>
    </h1>
  )
}
ReactDOM.render(<App />, document.getElementById('app'))
