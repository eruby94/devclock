import fs from 'fs'
import inquirer from 'inquirer'
import series from 'async/series'
import {
  timesheetExists,
  projectConfigExists,
  rootConfigExists,
  checkForUser,
  extractUser,
  getProjectListPath,
} from './util'

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

const addProjectToList = (cb) => {
  if (rootConfigExists()) {
    const projectListPath = getProjectListPath()
    // Extract existing project json
    const { projectList } = JSON.parse(fs.readFileSync(projectListPath, { encoding: 'utf-8' }))
    // Add current path to projectList as a string
    projectList.push(`${process.cwd()}`)
    fs.writeFile(projectListPath, JSON.stringify({ projectList }, null, 2), (err) => {
      if (err) throw err
      cb()
    })
  } else {
    console.log('Devclock has not yet been configured, please run devclock setup')
    cb()
  }
}

const promptForProjectName = (cb) => {
  const prompts = []
  prompts.push({
    type: 'input',
    name: 'title',
    message: 'What is the name of this project? (e.g. My Project)',
    default: 'My Project',
  })
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
}

export default () => {
  series(
    {
      projectName: !projectConfigExists
        ? promptForProjectName
        : (cb) => {
          console.log('devclock config file exists')
          cb()
        },
      checkForUser,
      user: extractUser,
      addProjectToList,
    },
    (err, results) => {
      if (err) throw err
      addUserToProject(results.user)
      console.log('devclock successfully configured!')
    },
  )
}
