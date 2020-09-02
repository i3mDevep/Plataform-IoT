import ReactDOM from 'react-dom'
import React, { useEffect } from 'react'
// import socketIOClient from 'socket.io-client'
import ListAgentComponent from './components/ListAgentsComponent'

// const ENDPOINT = 'http://localhost:8080'

function App () {
  useEffect(() => {
    // const socket = socketIOClient(ENDPOINT)
    // socket.on('agent/message', data => {
    //   console.log(data)
    // })
    // socket.on('agent/connected', data => {
    //   console.log(data)
    // })
    // socket.on('agent/disconnected', data => {
    //   console.log(data)
    // })
  }, [])

  return (
    <>
            <section className="hero is-info">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">React Vis</h1>
              <p className="subtitle">Visualize your data using React-Vis</p>
            </div>
          </div>
        </section>
        <ListAgentComponent />

    </>
  )
}
ReactDOM.render(<App />, document.getElementById('app'))
