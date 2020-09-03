import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import HeartBreak from '../assets/images/icons8-broken-heart-24.png'
import HeartLive from '../assets/images/icons8-heart-outline-24.png'

import axios from 'axios'

import LineChart from './charts/LineChart'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 745,
    margin: 'auto'
  },
  media: {
    height: 0,
    paddingTop: '26.25%'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
}))

export default function AgentCard ({ realTimeMessages, avatarColor, name, username, hostname, pid, connected = false, updatedAt, uuid }) {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)
  const [metrics, setMetrics] = React.useState([])
  const [realTimeMetrics, setRealTimeMetrics] = useState([])

  const handleExpandClick = async () => {
    connected && setExpanded(!expanded)
    if (connected) {
      const res = await axios.get(`http://localhost:8080/api/metrics/${uuid}`)
      if (!res.data.error.status) {
        setMetrics(res.data.body)
      }
    }
  }

  useEffect(() => {
    if(realTimeMessages.agent){
      if(realTimeMessages.agent.uuid === uuid){
        console.log('me corresponde a mi', realTimeMessages.agent.uuid)
        setRealTimeMetrics(realTimeMessages.metrics)
      }
    }

  },[realTimeMessages])
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label='recipe' style={{ backgroundColor: avatarColor }}>
            A
          </Avatar>
        }
        title={`${name} by ${username}`}
        subheader={updatedAt}
      />
      <CardMedia
        className={classes.media}
        image='https://cdn5.vectorstock.com/i/1000x1000/34/64/spy-agent-icon-vector-9493464.jpg'
        title='Agent'
      />
      <CardContent>
        <Typography variant='body2' color='textSecondary' component='h2'>
          hostname: {hostname}
        </Typography>
        <Typography variant='body2' color='textSecondary' component='h2'>
          uuid: {uuid}
        </Typography>
        <Typography variant='body2' color='textSecondary' component='h2'>
          pid: {pid}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label='heart'>
          <img src={connected ? HeartLive : HeartBreak} />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label='show more'
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          {
            metrics.map((metric, index) => <LineChart realTimeMetrics={realTimeMetrics} uuid={uuid} chartTitle={metric.type} backgroundColor={avatarColor} key={index} />)
          }
        </CardContent>
      </Collapse>
    </Card>
  )
}
