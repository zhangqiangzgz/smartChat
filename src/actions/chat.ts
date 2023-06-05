import ini from 'ini'
import { existsSync, readFileSync } from 'fs'
import { input } from '@inquirer/prompts'
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt'
import ora from 'ora'
import cliMarkdown from 'cli-markdown'
import crypto from 'node:crypto'
import Conf from 'conf'
import config from '../config'
import stdout from '../utils/stdout'
import type { FetchFn, ChatMessage } from 'chatgpt'

type ChatGPTUnofficialProxyAPIOptions = {
  accessToken: string
  apiReverseProxyUrl: string // defaultValue 
  debug: boolean // default value false
  fetch: FetchFn
  headers: Record<string, string>
  model: string // default value text-davinci-002-render-sha
}

type ChatOptions = {
  model: string
  continue: boolean
  store: boolean
  proxy: string
  chat: boolean
}

type ConversationType = {
  [key: string] : unknown
  lastMessgeId?: string
}

const hash = (value: string):string => crypto.createHash('sha256').update(Buffer.from(value)).digest('hex')

export default async function (prompt: string, options: ChatOptions, cache: typeof Conf) {

  try {
    if (!existsSync(config.authPath)) {
      throw new Error(stdout.yellow(`No authorization, please use the command ${stdout.blue('smartchat auth')} for authorization`))
    }
    const conf = ini.parse(readFileSync(config.authPath, 'utf-8'))

    if (!conf?.openaiApiKey && !conf?.openaiAccessToken) {
      throw new Error(stdout.yellow(`No authorization, please use the command ${stdout.blue('smartchat auth')} for authorization`))
    }

    // https://github.com/transitive-bullshit/chatgpt-api/blob/main/docs/interfaces/ChatMessage.md
    let message: ChatMessage
    let conversationId: string | undefined = undefined
    let parentMessageId: string | undefined = undefined
    let api: ChatGPTAPI | ChatGPTUnofficialProxyAPI

    const conversationKey = hash(conf.offical ? conf.openaiApiKey : conf.openaiAccessToken)
    let conversation: ConversationType  = {}

    if (options.continue && options.store) {
      conversation = cache.get(conversationKey, {}) || {}
    }

    if (conversation.lastMessgeId) {
      const lastMessage: ChatMessage = conversation[conversation.lastMessgeId] as ChatMessage
      if (lastMessage ) {
        conversationId = lastMessage.conversationId
        parentMessageId = lastMessage.id
      }
    }

    if (conf.offical) {
      api = new ChatGPTAPI({
        apiKey: conf.openaiApiKey,
        debug: false,
        completionParams: {
          model: options.model
        },
        getMessageById: async (id): Promise<any> => {
          if (options.store) {
            return conversation[id] as ChatMessage
          } else {
            return null
          }
        },
        upsertMessage: async (message) => {
          if (options.store) {
            conversation[message.id] = message
            conversation.lastMessgeId = message.id
            cache.set(conversationKey, conversation)
          }
        }
      })
    } else {
      api = new ChatGPTUnofficialProxyAPI({
        apiReverseProxyUrl: options.proxy,
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
      message =  await api.sendMessage(prompt, {
        // only relevant for ChatGPTUnofficialProxyAPI (optional for ChatGPTAPI)
        conversationId,
        // relevant for both ChatGPTAPI and ChatGPTUnofficialProxyAPI
        parentMessageId,
        // onProgress: (partialResponse) => {
        //   if (partialResponse.text) {
        //     if (lastConversation !== partialResponse.text) {
        //       console.log(cliMarkdown(partialResponse.text))
        //     }
        //     lastConversation = partialResponse.text
        //   }
        // }
      })

      if (options.store) {
        conversation.lastMessgeId = message.id
        conversation[message.id] = message
        cache.set(conversationKey, conversation)
      }
      spinner.stop()
      console.log(cliMarkdown(message.text))
      
      if (options.chat) {
        await nextPrompt()
      }
    }

    if (options.chat) {
      stdout.coolString('++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
      stdout.coolString('You are chatting with chatgpt, you can quit with "exit".')
      stdout.coolString('++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    }
    console.log(`${stdout.blue('prompt')}: ${prompt}`)
    await inConversation()

  } catch (error) {
    stdout.error(error as string)
    process.exit(1)
  }
}