import { cac } from 'cac'
import { fileURLToPath } from 'url'
import path from 'path'
import Conf from 'conf'
import { readPackageUpSync } from 'read-pkg-up'
import auth from './actions/auth'
import deauth from './actions/deauth'
import chat from './actions/chat'
import stdout from './utils/stdout'

async function main () {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const pkg = readPackageUpSync({ cwd: __dirname })
  const packageName = pkg && pkg.packageJson.name || 'smartchat'
  const version = pkg && pkg.packageJson.version || '1.0.0'

  const cache = new Conf({ 
    projectName: 'smartchat'
  })

  const cli = cac(packageName)
  cli
   .command('auth', 'Set a openai api key or access token')
   .option('--offical', 'Choose the official ChatGPT API')
   .option('--no-offical', 'Choose the unofficial proxy API')
   .action(async (options)=> {
    await auth(options)
  })

  cli
    .command('deauth', 'Remove openai api key or access token')
    .action(async () => {
      await deauth()
   })

  cli
    .command('<prompt>', 'Ask ChatGPT a question')
    .option('-c, --continue', 'Continue last conversation', {
      default: false
    })
    .option('-s, --store', 'Enables the local message cache', {
      default: true
    })
    // .option('--stream', 'Streams the response', {
    //   default: true
    // })
    .option('--chat', 'Continuous dialogue mode', {
      default: false
    })
    .option('-p, --proxy <proxy>', 'Provide a reverse proxy for unofficial proxy API', {
      default: 'https://ai.fakeopen.com/api/conversation'
    })
    .option('-m, --model <model>', 'Model for the official ChatGPT API', {
      default: 'gpt-3.5-turbo'
    })
    .action(async (prompt, options) => {
      await chat(prompt, options, cache)
    })

  cli
    .command('rm-cache', 'Clear the local message cache')
    .action(() => {
      cache.clear()
      stdout.success(`Cache cleared`)
    })

  cli
    .command('ls-cache', 'Output the local message cache file path')
    .action(() => {
      stdout.info(cache.path)
    })

  cli.help()
  cli.version(version)
  
  try {
    cli.parse()
  } catch (error: any) {
    stdout.error(`${error.message}\n`)
    cli.outputHelp()
    process.exit(1)
  }
}

main().catch((error) => {
  stdout.error(error)
  // abnormal exit
  process.exit(1)
})
