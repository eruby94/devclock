import fs from 'fs'
import os from 'os'
import moment from 'moment-timezone'

export const extractJSON = path => JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }))

export const rootConfigExists = () => fs.existsSync(`${os.homedir()}/.devclock/`)

export const projectConfigExists = () => fs.existsSync(`${process.cwd()}/devclock.config.json`)

export const checkForUser = (cb) => {
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

export const extractUser = (cb) => {
  const dev = extractJSON(`${os.homedir()}/.devclock/dev.json`)
  cb(null, dev.fullName.replace(/\s+/g, ''))
}

export const getTimesheetPath = devUser => `${process.cwd()}/.${devUser}.devclock.json`

export const timesheetExists = devUser =>
  fs.existsSync(`${process.cwd()}/.${devUser}.devclock.json`)

export const adjustTimesheet = (devUser, shouldClockIn) => {
  if (timesheetExists(devUser)) {
    // Extract timesheet json
    const updatedTimesheet = extractJSON(getTimesheetPath(devUser))
    if (shouldClockIn) {
      const timeIn = moment()
      // Add new timesheet entry, with clock-out to match clock-in time.
      // This is done because of the chance that no punch out is recorded on a given day.
      updatedTimesheet.entryList.push({
        timeIn,
        timeOut: timeIn,
      })
    } else {
      const lastEntry = updatedTimesheet.entryList.pop()
      if (moment().date() === moment(lastEntry.timeIn).date()) {
        // Update timeOut if the timeIn is from today
        lastEntry.timeOut = moment()
      } else {
        console.log('Last time in recorded is not from today. Please review timesheet.')
      }
      updatedTimesheet.entryList.push(lastEntry)
    }
    // Overwrite existing timesheet with updated JSON
    fs.writeFile(getTimesheetPath(devUser), JSON.stringify(updatedTimesheet, null, 2), (err) => {
      if (err) throw err
    })
  } else {
    console.log('User has not yet been added to the project, please run devclock init')
  }
}

export const getProjectListPath = () => `${os.homedir()}/.devclock/projects.json`
