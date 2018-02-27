#!/usr/bin/env node

const thisLib = require('../lib/index.js').default

const args = process.argv.splice(process.execArgv.length + 2)

const command = args[0]

//TODO allow for time in and out to be passed in as CLI args (--time=hh:mm am/pm)

if (command === 'in') {
  thisLib.clockIn()
} else if (command === 'out') {
  thisLib.clockOut()
} else if (command === 'init') {
  thisLib.init()
}
