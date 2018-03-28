const fs = require('fs')
const os = require('os')
const inquirer = require('inquirer')

if (!fs.existsSync(`${os.homedir()}/.devclock/`)) {
  fs.mkdir(`${os.homedir()}/.devclock`, (err) => {
    if (err) throw err
    const prompts = [
      {
        type: 'input',
        name: 'fullName',
        message: 'What is your full name?',
        default: 'Joe Shmo',
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
  console.log('Profile exists, skipping setup')
}
