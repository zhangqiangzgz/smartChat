import ini from 'ini'
import { existsSync, readFileSync } from 'fs'
import { input } from '@inquirer/prompts'
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt'
import ora from 'ora'
import cliMarkdown from 'cli-markdown'
import logUpdate from 'log-update'
import config from '../config'
import stdout from '../utils/stdout'
import type { FetchFn, ChatMessage, ChatGPTAPIOptions } from 'chatgpt'

type ChatGPTUnofficialProxyAPIOptions = {
  accessToken: string
  apiReverseProxyUrl: string // defaultValue 
  debug: boolean // default value false
  fetch: FetchFn
  headers: Record<string, string>
  model: string // default value text-davinci-002-render-sha
}

export default async function (prompt: string) {

  try {
    if (!existsSync(config.authPath)) {
      throw new Error(stdout.yellow(`No authorization, please use the command ${stdout.blue('smartchat auth')} for authorization`))
    }
    const conf = ini.parse(readFileSync(config.authPath, 'utf-8'))

    if (!conf?.openaiApiKey && !conf?.openaiAccessToken) {
      throw new Error(stdout.yellow(`No authorization, please use the command ${stdout.blue('smartchat auth')} for authorization`))
    }

    // https://github.com/transitive-bullshit/chatgpt-api/blob/main/docs/interfaces/ChatMessage.md
    let result: ChatMessage
    let conversationId: string | undefined
    let parentMessageId: string | undefined = undefined
    let api: ChatGPTAPI | ChatGPTUnofficialProxyAPI

    if (conf.offical) {
      api = new ChatGPTAPI({
        apiKey: conf.openaiApiKey,
        debug: false
      })
    } else {
      api = new ChatGPTUnofficialProxyAPI({
        apiReverseProxyUrl: 'https://ai.fakeopen.com/api/conversation',
        accessToken: conf.openaiAccessToken,
        debug: false
      })
    }

    const nextPrompt = async () => {
      const answer = await input({
        message: stdout.blue(`next prompt: `)
      })

      if (answer) {
        prompt = answer
        await inConversation()
      } else {
        await nextPrompt()
      }
    }

    let lastConversation = ''

    const inConversation = async () => {
      const spinner = ora({
        text: stdout.blue('Awaiting reply from chatgpt...'),
      })
      spinner.start()
      result =  await api.sendMessage(prompt, {
        // only relevant for ChatGPTUnofficialProxyAPI (optional for ChatGPTAPI)
        conversationId: conversationId,
        // relevant for both ChatGPTAPI and ChatGPTUnofficialProxyAPI
        parentMessageId: parentMessageId,
        // onProgress: (partialResponse) => {
        //   if (partialResponse.text) {
        //     if (lastConversation !== partialResponse.text) {
        //       console.log(cliMarkdown(partialResponse.text))
        //     }
        //     lastConversation = partialResponse.text
        //   }
        // }
      })
      parentMessageId = result.id
      conversationId = result.conversationId
      spinner.stop()
      console.log(cliMarkdown(result.text))
      
      await nextPrompt()
    }

    console.log(`${stdout.blue('prompt')}: ${prompt}`)
    await inConversation()

  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}