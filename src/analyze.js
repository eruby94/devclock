// import fs from 'fs'
import waterfall from 'async/waterfall'
import moment from 'moment-timezone'
import {
  extractJSON,
  rootConfigExists,
  getProjectListPath,
  checkForUser,
  extractUser,
} from './util'

const getBlockDuration = (entry) => {
  const timeIn = moment(entry.timeIn)
  const timeDiff = moment(entry.timeOut).diff(timeIn, 'hours', true)
  return timeDiff
}

const getProjectTimeWorked = (entryList) => {
  let total = 0
  for (let i = 0; i < entryList.length; i++) {
    total += getBlockDuration(entryList[i])
  }
  return total
}

const extractUserTimesheets = (user, cb) => {
  const timesheetData = {
    projects: {},
    totalStatistics: {
      totalHoursWorked: 0,
      averageHoursPerBlock: 0,
    },
  }
  if (rootConfigExists()) {
    const { projectList } = extractJSON(getProjectListPath())
    for (let i = 0; i < projectList.length; i++) {
      const projectPath = projectList[i]
      const projectName = projectPath.substring(projectPath.lastIndexOf('/') + 1)
      const project = extractJSON(`${projectList[i]}/.${user}.devclock.json`)
      const projectHoursWorked = getProjectTimeWorked(project.entryList)
      project.statistics = {}
      project.statistics.totalHoursWorked = projectHoursWorked
      project.statistics.averageHoursPerBlock = projectHoursWorked / project.entryList.length
      timesheetData.projects[projectName] = project
      timesheetData.totalStatistics.totalHoursWorked += projectHoursWorked
      timesheetData.totalStatistics.averageHoursPerBlock += project.statistics.averageHoursPerBlock
    }
    timesheetData.totalStatistics.averageHoursPerBlock /= Object.keys(timesheetData.projects).length
  } else {
    console.log('Devclock has not yet been configured, please run devclock setup')
  }
  cb(null, timesheetData)
}

export default () => {
  waterfall([checkForUser, extractUser, extractUserTimesheets], (err, result) => {
    if (err) throw err
    // TODO allow for start day and end day to be passed as params for a report to be generated
    console.log(JSON.stringify(result, null, 2))
  })
}
