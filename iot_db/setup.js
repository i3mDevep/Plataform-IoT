'use strict'

const inquirer = require('inquirer')
const db = require('./')
const utils = require('iot-utils')
const config = utils.db.config_db(true)
const handleFatalError = utils.errors.handleFatalError

const prompt = inquirer.createPromptModule()

async function setup () {
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'This action will destroy your database, are yout sure?'
    }
  ])

  if (!answer.setup) {
    return console.log('Nothing happend :)')
  }

  await db(config).catch(handleFatalError)
  console.log('Todo salio bien papi, base de datos bien y mejorando!')
  process.exit(0)
}

setup()

