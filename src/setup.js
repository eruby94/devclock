import fs from 'fs'
import os from 'os'
import inquirer from 'inquirer'
import series from 'async/series'
import { rootConfigExists } from './util'

const createRootConfigDir = (cb) => {
  fs.mkdir(`${os.homedir()}/.devclock`, (err) => {
    if (err) throw err
    cb()
  })
}

const getDeveloperInfo = (cb) => {
  const prompts = [
    {
      type: 'input',
      name: 'fullName',
      message: 'What is your full name?',
    },
  ]
  inquirer.prompt(prompts).then((answers) => {
    fs.writeFile(`${os.homedir()}/.devclock/dev.json`, JSON.stringify(answers, null, 2), (err) => {
      if (err) throw err
      cb()
    })
  })
}

const createProjectList = (cb) => {
  fs.writeFile(
    `${os.homedir()}/.devclock/projects.json`,
    JSON.stringify({ projectList: [] }),
    (err) => {
      if (err) throw err
      cb()
    },
  )
}

export default () => {
  if (!rootConfigExists()) {
    series([createRootConfigDir, getDeveloperInfo, createProjectList], (err) => {
      if (err) throw err
      console.log('Devclock profile setup complete :)')
    })
  } else {
    console.log('Profile exists, skipping setup')
  }
}
