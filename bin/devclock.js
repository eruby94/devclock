#!/usr/bin/env node

const thisLib = require('../lib/index.js').default

const args = process.argv.splice(process.execArgv.length + 2)

const command = args[0]

if (command === 'in') {
  thisLib.clockIn(args.slice(1))
} else if (command === 'out') {
  thisLib.clockOut(args.slice(1))
} else if (command === 'init') {
  thisLib.init()
}
