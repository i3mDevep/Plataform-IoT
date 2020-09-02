import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import AgentCard from './AgentCard'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: '0 20%',
    '@media (max-width: 848px)': {
        margin: 0
    },
  }
}))

const ListAgentComponent = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>

        {
          [1, 2, 4, 5].map(agent =>
          <Grid item md={12} style={{ margin: 'auto' }}>
            <AgentCard avatarColor={'#' + Math.floor(Math.random() * 16777215).toString(16)} {...agent} />
          </Grid>
          )

        }
      </Grid>
    </div>
  )
}

export default ListAgentComponent
