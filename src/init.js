import fs from 'fs'
import inquirer from 'inquirer'

export default () => {
  const prompts = []
  // If no config is found
  if (!fs.existsSync(`${process.cwd()}/devclock.config.json`)) {
    // Add devclock sheets to the .gitignore
    fs.appendFileSync(`${process.cwd()}/.gitignore`, '\n.*.devclock\n')
    // Add prompt for the project name
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
          console.log('devclock successfully configured!')
        },
      )
    })
  } else {
    console.log('devclock config file exists, aborting...')
  }
}
