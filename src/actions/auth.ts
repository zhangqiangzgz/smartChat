import config from '../config'
import { input } from '@inquirer/prompts'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import ini from 'ini'

export default async function (offical: boolean) {
  try {
    // No duplicate login required
    if (existsSync(config.authPath)) {
      const conf = ini.parse(readFileSync(config.authPath, 'utf-8'))
      if (conf.openaiApiKey || conf.openaiAccessToken) {
        console.log(`You are authorized to use chatgpt, please try the command smartchat <prompt> to start your chat`)
        process.exit(0)
      }
    }

    const answer: string = await input({
      message: offical ? 'Please enter a openai api key' : 'Please enter a openai access token'
    })
  
    if (!answer) {
      throw new Error(offical ? 'No openai api key privided' : 'No openai access token provided')
    }

    // save login info
    const setConf = (offical: boolean, answer: string): void => {
      const conf = ini.parse(readFileSync(config.authPath, 'utf-8'))
      if (offical) {
        conf.openaiApiKey = answer
      } else {
        conf.openaiAccessToken = answer
      }
      writeFileSync(config.authPath, ini.stringify(conf))
    }

    if (!existsSync(config.authPath)) {
      writeFileSync(config.authPath, 'utf-8')
      setConf(offical, answer)
    } else {
      setConf(offical, answer)
    }

    process.exit(0)
  } catch (error) {
    console.log(`error: ${error}`)
    process.exit(1)
  }
}