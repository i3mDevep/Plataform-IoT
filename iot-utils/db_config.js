'use strict'

const debug = require('debug')('iot:db_config')

function config_db (force = false) {
    const config = {
        database: process.env.DB_NAME || 'i3miot_db',
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        loggin: s => debug(s),
        setup: force
    }
    return config
}
module.exports = {
    config_db
}