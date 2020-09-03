import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import AgentCard from './AgentCard'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    margin: '0 20%',
    '@media (max-width: 848px)': {
      margin: 0
    }
  }
}))

const ListAgentComponent = ({ messages, agents }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>

        {
          agents.map(agent =>
            <Grid key={agent.id} item md={12} style={{ margin: 'auto' }}>
              <AgentCard realTimeMessages={messages} avatarColor={'#' + Math.floor(Math.random() * 16777215).toString(16)} {...agent} />
            </Grid>
          )

        }
      </Grid>
    </div>
  )
}

export default ListAgentComponent
