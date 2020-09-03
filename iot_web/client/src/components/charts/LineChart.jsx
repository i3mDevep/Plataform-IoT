import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'

function hexToRgbA (hex, a = 1) {
  var c
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('')
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = '0x' + c.join('')
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + a + ')'
  }
  return 'rgba(255, 255, 255, 0.4)'
}

const legend = {
  display: true,
  position: 'bottom',
  labels: {
    fontColor: '#323130',
    fontSize: 14
  }
}

export default ({ backgroundColor = '#fbafff', chartTitle, uuid, realTimeMetrics }) => {
  const [metrics, setMetrics] = useState([])
  const [ejeX, setEjeX] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const mymetrics = []
      const myx = []

      const result = await axios.get(`http://localhost:8080/api/metrics/${uuid}/${chartTitle}`)
      result.data.body.forEach((m) => {
        mymetrics.push(m.value)
        myx.push(m.createdAt)
      })
      setMetrics(mymetrics)
      setEjeX(myx)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const newMetrics= realTimeMetrics.find(metric => metric.type === chartTitle)
    if (newMetrics){
      let overwrite = metrics
      let overwriteX = ejeX
      if(overwrite.length >= 20){
        overwrite.shift()
      }
      if(overwriteX.length >= 20){
        overwriteX.shift()
      }
      overwrite.push(newMetrics.value)
      overwriteX.push(new Date())
      setMetrics(overwrite)
    }
    console.log('estas son la metricas real time', newMetrics)

  },[realTimeMetrics])
  const options = {
    title: {
      display: true,
      text: chartTitle.toUpperCase(),
      fontSize: 14
    }

  }
  const data = {
    labels: ejeX,
    datasets: [
      {
        label: chartTitle,
        data: metrics,
        fill: true,
        backgroundColor: '#fbafff',
        borderColor: hexToRgbA(backgroundColor, 1)
      }
    ]
  }
  return (
    <div className='App'>
      <Line data={data} legend={legend} options={options} />
    </div>
  )
}
