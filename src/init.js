import fs from 'fs'
import inquirer from 'inquirer'
import series from 'async/series'
import { timesheetExists, projectConfigExists, checkForUser, extractUser } from './util'

const addUserToProject = (devUser) => {
  // Strip all whitespace from devUser
  // Check if user timesheet exists
  if (!timesheetExists(devUser)) {
    // If it doesn't, create the timesheet
    fs.writeFileSync(
      `${process.cwd()}/.${devUser}.devclock.json`,
      JSON.stringify({ entryList: [] }, null, 2),
    )
  } else {
    // Otherwise, provide log message
    console.log('timesheet already exists, skipping...')
  }
}

export default () => {
  const prompts = []
  const fnSeries = []
  // If no config is found
  if (!projectConfigExists()) {
    // Add devclock sheets to the .gitignore
    // fs.appendFileSync(`${process.cwd()}/.gitignore`, '\n.*.devclock.json\n')
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
  // TODO add project path to root configuration
  fnSeries.push((cb) => {
    checkForUser(cb)
  })
  fnSeries.push((cb) => {
    extractUser(cb)
  })
  series(fnSeries, (err, results) => {
    if (err) throw err
    addUserToProject(results[results.length - 1])
    console.log('devclock successfully configured!')
  })
}
