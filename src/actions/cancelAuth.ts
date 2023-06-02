import ora from 'ora'
import { existsSync, unlinkSync } from 'fs'
import config from '../config'
import stdout from '../utils/stdout'


export default async function () {
  try {
    if (existsSync(config.authPath)) {
      const spinner = ora({
        text: stdout.blue('Cancel authorization...')
      })
      spinner.start()
      unlinkSync(config.authPath)
      spinner.succeed(stdout.green('Cancel authorization successfully'))
    }
  } catch (error) {
    stdout.error(`cancel auth error: ${error}`)
    process.exit(1)
  }
}