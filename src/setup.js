import fs from 'fs'
import os from 'os'
import inquirer from 'inquirer'
import { rootConfigExists } from './util'

export default () => {
  // Check for root configuration folder
  if (!rootConfigExists()) {
    // If not found, prompt for user info
    fs.mkdir(`${os.homedir()}/.devclock`, (err) => {
      if (err) throw err
      const prompts = [
        {
          type: 'input',
          name: 'fullName',
          message: 'What is your full name?',
        },
      ]
      inquirer.prompt(prompts).then((answers) => {
        fs.writeFile(
          `${os.homedir()}/.devclock/dev.json`,
          JSON.stringify(answers, null, 2),
          (writeErr) => {
            if (writeErr) throw writeErr
            console.log('Devclock profile setup complete :)')
          },
        )
      })
    })
  } else {
    // Otherwise, provide log message
    console.log('Profile exists, skipping setup')
  }
}
