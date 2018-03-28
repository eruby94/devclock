import fs from 'fs'
import inquirer from 'inquirer'
import os from 'os'
import series from 'async/series'

const checkForUser = (cb) => {
  fs.open(`${os.homedir()}/.devclock/dev.json`, 'r', (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('User profile does not exist. Please run devclock setup')
        return
      }
      throw err
    }
    cb()
  })
}

const addUserToProject = (devUser) => {
  const username = devUser.fullName.replace(/\s+/g, '')
  if (!fs.existsSync(`${process.cwd()}/.${username}.devclock.json`)) {
    fs.closeSync(fs.openSync(`${process.cwd()}/.${username}.devclock.json`, 'a'))
  } else {
    console.log('timesheet already exists, skipping...')
  }
}

export default () => {
  const prompts = []
  const fnSeries = []
  // If no config is found
  if (!fs.existsSync(`${process.cwd()}/devclock.config.json`)) {
    // Add devclock sheets to the .gitignore
    fs.appendFileSync(`${process.cwd()}/.gitignore`, '\n.*.devclock.json\n')
    // Add prompt for the project name
    prompts.push({
      type: 'input',
      name: 'title',
      message: 'What is the name of this project? (e.g. My Project)',
      default: 'My Project',
    })
    fnSeries.push((cb) => {
      inquirer.prompt(prompts).then((answers) => {
        // Write initial config to devclock.config.json
        fs.writeFile(
          `${process.cwd()}/devclock.config.json`,
          JSON.stringify({ title: answers.title }, null, 2),
          (err) => {
            if (err) throw err
            cb()
          },
        )
      })
    })
  } else {
    console.log('devclock config file exists')
  }
  fnSeries.push((cb) => {
    checkForUser(cb)
  })
  fnSeries.push((cb) => {
    const dev = JSON.parse(fs.readFileSync(`${os.homedir()}/.devclock/dev.json`, { encoding: 'utf-8' }))
    cb(null, dev)
  })
  series(fnSeries, (err, results) => {
    if (err) throw err
    addUserToProject(results[results.length - 1])
    console.log('devclock successfully configured!')
  })
}
