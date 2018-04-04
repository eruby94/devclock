#!/usr/bin/env node

const thisLib = require('../lib/index.js').default

const args = process.argv.splice(process.execArgv.length + 2)

const command = args[0]

if (command === 'in') {
  thisLib.clockIn()
} else if (command === 'out') {
  thisLib.clockOut()
} else if (command === 'init') {
  thisLib.init()
} else if (command === 'setup') {
  thisLib.setup()
} else if (command === 'analyze') {
  thisLib.analyze()
}
