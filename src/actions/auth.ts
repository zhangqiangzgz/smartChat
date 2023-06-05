import config from '../config'
import { input } from '@inquirer/prompts'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import ini from 'ini'
import stdout from '../utils/stdout'

type AuthOptions = {
  offical: boolean
}

export default async function (options: AuthOptions) {
  const { offical } = options
  try {
    // No duplicate login required
    if (existsSync(config.authPath)) {
      const conf = ini.parse(readFileSync(config.authPath, 'utf-8'))
      if (conf.openaiApiKey || conf.openaiAccessToken) {
        stdout.info(`You are authorized to use chatgpt, please try the command smartchat <prompt> to start your chat`)
        process.exit(0)
      }
    }

    const answer: string = await input({
      message: offical ? 'Please enter a OpenAI API key' : 'Please enter a OpenAI Access Token'
    })
  
    if (!answer) {
      throw new Error(offical ? 'No OpenAI API key privided' : 'No OpenAI Access Token provided')
    }

    // save login info
    const setConf = (offical: boolean, answer: string): void => {
      const conf = ini.parse(readFileSync(config.authPath, 'utf-8'))
      if (offical) {
        conf.openaiApiKey = answer
      } else {
        conf.openaiAccessToken = answer
      }
      conf.offical = offical
      writeFileSync(config.authPath, ini.stringify(conf))
    }

    if (!existsSync(config.authPath)) {
      writeFileSync(config.authPath, 'utf-8')
      setConf(offical, answer)
    } else {
      setConf(offical, answer)
    }

    stdout.success('Authorization is successful, please use command "smartchat <prompt>" to start a conversation with chatgpt')
    
    process.exit(0)
  } catch (error) {
    stdout.error(`${error}`)
    process.exit(1)
  }
}