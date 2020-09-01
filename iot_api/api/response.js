'use strict'

exports.success = (req, res, message, status) => {
  res.status(status || 200).send({
    error: { status: false, message: '' },
    body: message
  })
}
exports.error = (req, res, error, status) => {
  res.status(status || 500).send({
    error: { status: true, message: error || 'error desconocido' },
    body: ''
  })
}
