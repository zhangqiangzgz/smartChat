import { existsSync, readFileSync, writeFileSync } from 'fs'
import ini from 'ini'
import config from '../config'

export default async function () {
  if (existsSync(config.authPath)) {
    const conf = ini.parse(readFileSync(config.authPath, 'utf-8'))
    if (typeof conf.openaiApiKey !== 'undefined' && conf.openaiApiKey) {
      conf.openaiApiKey = ''
    }
    if (typeof conf.openaiAccessToken !== 'undefined' && conf.openaiAccessToken) {
      conf.openaiAccessToken = ''
    }
    writeFileSync(config.authPath, ini.stringify(conf))
  }

  console.log(`Cancel authorization successfully`)
  process.exit(0)
}