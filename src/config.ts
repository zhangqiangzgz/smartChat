import path from 'path'
import os from 'os'
import { existsSync } from 'fs'

const authPath = path.join(os.homedir(), '.smartchat')

export default {
  authPath
}

export const configFileExist = (): boolean => {
  return existsSync(authPath)
}