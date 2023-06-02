import { cac } from 'cac'
import { fileURLToPath } from 'url'
import path from 'path'
import { readPackageUpSync } from 'read-pkg-up'

async function main () {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const pkg = readPackageUpSync({ cwd: __dirname })
  const packageName = pkg && pkg.packageJson.name || 'smartchat'
  const version = pkg && pkg.packageJson.version || '1.0.0'

  const cli = cac(packageName)
  cli
   .command('auth', 'Get a openai api key or access token')
   .option('--offical', 'Choose a ChatGPTAPI')
   .option('--no-offical', 'Choose a ChatGPTUnofficalAPI')
   .action((command, options)=> {
    console.log(command)
    console.log(options)
  })

  cli
    .command('cancelAuth', 'remove openai api key or access token')
    .action(() => {
    console.log(`cancel`)
   })

  cli
    .command('<prompt>', 'Ask ChatGPT a question')
    .action((prompt) => {
      console.log(`prompt: ${prompt}`)
    })

  cli.help()
  cli.version(`${packageName}@${version}`)
  
  try {
    cli.parse()
  } catch (error: any) {
    console.error(`error: ${error.message}\n`)
    cli.outputHelp()
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  // 异常退出
  process.exit(1)
})
