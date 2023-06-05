<div align="center">
<h1>smartchat</h1>
Interact with ChatGPT from the command-line.
</div

[![NPM](https://img.shields.io/npm/v/smartcaht.svg)](https://www.npmjs.com/package/smartcaht) [![Build Status](https://github.com/zhangqiangzgz/smartchat/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/zhangqiangzgz/smartchat/actions/workflows/npm-publish.yml) [![MIT License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/zhangqiangzgz/smartchat/blob/main/license)

## Features
- [Chat](#use-the-official-chatgpt-model) with [ChatGPT]() from the command-line
- Support both the [official ChatGPT API](#about-the-official-chatgpt-api-and-the-unofficial-proxy-api) and the [unofficial proxy API](#about-the-official-chatgpt-api-and-the-unofficial-proxy-api) of [ChatGPT API](https://github.com/transitive-bullshit/chatgpt-api)
- Supports both [Q&A](#qa) and [Chat](#chat) modes
- One authorization, no need to re-authorize within a short period of time
- [Node](https://github.com/nodejs/node) based implementation
- Rich tips, colored symbols for various log levels
- Conversation stored in a local file

## Install
```bash
$ npm install smartchat -g
```
**Note:** Make sure you're using `node >= 18` so `fetch` is available (or `node >= 14` if you install a [fetch polyfill](https://github.com/developit/unfetch#usage-as-a-polyfill)).

## Usage
Before use smartchat, you may need to pass the *'Authorization'*.
### Authorization
```bash
$ smartchat auth
```
By default, it will choose the [official ChatGPT API](#about-the-official-chatgpt-api-and-the-unofficial-proxy-api) and then you have to provide an [OpenAI API key](https://platform.openai.com/overview) for authorization.
```shell
D:\git-project\smartChat>smartchat auth
? Please enter a OpenAI API key <your OpenAI API key>
√ Authorization is successful, please use command "smartchat <prompt>" to start a conversation with chatgpt

D:\git-project\smartChat>
```
Alternatively, you can use `--no-offical` to choose an [unofficial proxy API](#about-the-official-chatgpt-api-and-the-unofficial-proxy-api) and provide an [Access Token](#access-token) for authorization.
```shell
D:\git-project\smartChat>smartchat auth --no-offical
? Please enter a OpenAI Access Token <your OpenAI Access Token>
√ Authorization is successful, please use command "smartchat <prompt>" to start a conversation with chatgpt

D:\git-project\smartChat>
```

### Q&A
In Q&A mode, after you provide a prompt, chatgpt will give you the result and then immediately exit automatically.
```bash
$ smartchat <prompt>
```

```shell
D:\git-project\smartChat>smartchat "Who are you ?"
prompt: Who are you ?

 I am ChatGPT, a language model developed by OpenAI. I'm designed to assist with a wide range of questions and provide
 information on various topics. How can I assist you today?

D:\git-project\smartChat>
```

### Chat
Chat mode allows you to talk to chatgpt continuously in real time, you can use `exit` to exit the conversation.
```bash
$ smartchat <prompt> --chat
```

```shell
D:\git-project\smartChat>smartchat "Who are you ?" --chat
++++++++++++++++++++++++++++++++++++++++++++++++++++++++
You are chatting with chatgpt, you can quit with "exit".
++++++++++++++++++++++++++++++++++++++++++++++++++++++++
prompt: Who are you ?

 I am ChatGPT, an AI language model developed by OpenAI. I'm designed to assist with answering questions, providing
 information, and engaging in conversations on a wide range of topics. How can I assist you today?


? next prompt:  "What can you assist me ?"

 I can assist you with a wide range of topics and tasks. Here are a few examples:

  1. Answering questions: I can provide information on various subjects, including science, history, geography, sports,
     and more. Just ask me anything you'd like to know!

  2. Writing assistance: If you need help with writing, whether it's for academic purposes, creative writing, or
     professional documents, I can offer suggestions, grammar and style corrections, and help you improve your overall
     writing quality.

    .....

 Please let me know what specific assistance you require, and I'll do my best to help you!

? next prompt:
```

### Deauthorization
```bash
$ smartchat deauth
```
When you execute the above command, your [OpenAI API key](https://platform.openai.com/overview) or [Access Token]() will be removed from this local config file.
## Cli
By default, the results are stored in a local config file, and every invocation starts a new conversation. You can use -c to continue the previous conversation.
```
Usage:
  $ smartchat <prompt>

Commands:
  auth        Set a openai api key or access token
  deauth      remove openai api key or access token
  <prompt>    Ask ChatGPT a question

For more info, run any command with the `--help` flag:
  $ smartchat auth --help
  $ smartchat deauth --help
  $ smartchat --help

Options:
  -c, --continue       Continue last conversation (default: false)
  -s, --store          Enables the local message cache (default: true)
  --chat               Continuous dialogue mode (default: false)
  -p, --proxy <proxy>  Provide a reverse proxy for ChatGPTUnofficalAPI (default: https://ai.fakeopen.com/api/conversation)
  -m, --model <model>  Model for ChatGPTAPI (default: gpt-3.5-turbo)
  -h, --help           Display this message
  -v, --version        Display version number
```

## About the official ChatGPT API and the unofficial proxy API

| Method                      | Free?  | Robust? | Quality?                        |
| --------------------------- | ------ | ------- | ------------------------------- |
| `ChatGPTAPI`                | ❌ No  | ✅ Yes  | ✅️ Real ChatGPT models + GPT-4 |
| `ChatGPTUnofficialProxyAPI` | ✅ Yes | ❌ No️  | ✅ ChatGPT webapp               |

1. `ChatGPTAPI` - Uses the `gpt-3.5-turbo` model with the official OpenAI chat completions API (official, robust approach, but it's not free)
2. `ChatGPTUnofficialProxyAPI` - Uses an unofficial proxy server to access ChatGPT's backend API in a way that circumvents Cloudflare (uses the real ChatGPT and is pretty lightweight, but relies on a third-party server and is rate-limited)

## Access Token for unofficial proxy API


### Reverse Proxy

By default, the reverse proxy is `https://ai.fakeopen.com/api/conversation` for the [unofficial proxy API](#about-the-official-chatgpt-api-and-the-unofficial-proxy-api), You can override the reverse proxy:

```bash
$ smartchat <prompt> --proxy <url>
```

Known reverse proxies run by community members include:

| Reverse Proxy URL                                 | Author                                       | Rate Limits                  | Last Checked |
| ------------------------------------------------- | -------------------------------------------- | ---------------------------- | ------------ |
| `https://ai.fakeopen.com/api/conversation` | [@pengzhile](https://github.com/pengzhile)   | 5 req / 10 seconds by IP     | 4/18/2023    |
| `https://api.pawan.krd/backend-api/conversation`  | [@PawanOsman](https://github.com/PawanOsman) | 50 req / 15 seconds (~3 r/s) | 3/23/2023    |

Note: info on how the reverse proxies work is not being published at this time in order to prevent OpenAI from disabling access.

### Access Token

To use [unofficial proxy API](#about-the-official-chatgpt-api-and-the-unofficial-proxy-api), you'll need an OpenAI access token from the ChatGPT webapp. To do this, you can use any of the following methods which take an `email` and `password` and return an access token:

- Node.js libs
  - [ericlewis/openai-authenticator](https://github.com/ericlewis/openai-authenticator)
  - [michael-dm/openai-token](https://github.com/michael-dm/openai-token)
  - [allanoricil/chat-gpt-authenticator](https://github.com/AllanOricil/chat-gpt-authenticator)

These libraries work with email + password accounts (e.g., they do not support accounts where you auth via Microsoft / Google).

Alternatively, you can manually get an `accessToken` by logging in to the ChatGPT webapp and then opening `https://chat.openai.com/api/auth/session`, which will return a JSON object containing your `accessToken` string:
```json
{
    "user": {
        "id": " ",
        "name": " ",
        "email": " ",
        "image": " ",
        "picture": " ",
        "idp": " ",
        "iat":  ,
        "mfa": false,
        "groups": [],
        "intercom_hash": ""
    },
    "expires": "2023-06-27T14:22:43.040Z",
    "accessToken": "",
    "authProvider": ""
}
```

Access tokens last for days.

**Note**: using a reverse proxy will expose your access token to a third-party. There shouldn't be any adverse effects possible from this, but please consider the risks before using this method.

## Note 
Because of the way Terminals are built, it is not possible to update a text outside the viewport of the terminal. So for the time being, it is not possible to achieve real-time typing output in the terminal.

We strongly recommend the [official ChatGPT API](#about-the-official-chatgpt-api-and-the-unofficial-proxy-api) since it use the officially supported API from OpenAI. The [unofficial proxy API](#about-the-official-chatgpt-api-and-the-unofficial-proxy-api) may be removed in a future release.

## Author

**smartchat** © [zhangqiangzgz](https://github.com/zhangqiangzgz), Released under the [MIT](./LICENSE) License.
Authored and maintained by zhangqiangzgz.

> GitHub [@zhangqiangzgz](https://github.com/zhangqiangzgz)