import kleur from "kleur"
import ls from 'log-symbols'
import gradient  from 'gradient-string'

const log = (message: string): unknown => {
  return console.log(message)
}

const coolString = (message: string): unknown => {
  return console.log(gradient('cyan', 'pink')(message))
}

const error = (message: string): unknown => {
  return console.log(ls.error, kleur.bold().red().italic(message))
}

const info = (message: string): unknown => {
  return console.log(ls.info, kleur.bold().blue().italic(message))
}

const warn = (message: string): unknown => {
  return console.log(ls.warning, kleur.bold().yellow().italic(message))
}
const success = (message: string): unknown => {
  return console.log(ls.success, kleur.bold().green().italic(message))
}

const green = (message: string): string => {
  return kleur.bold().green().italic(message)
}

const yellow = (message: string): string => {
  return kleur.bold().yellow().italic(message)
}

const blue = (message: string): string => {
  return kleur.bold().blue().italic(message)
}

const red = (message: string): string => {
  return kleur.bold().red().italic(message)
}

export default {
  log,
  coolString,
  error,
  info,
  warn,
  success,
  green,
  blue,
  yellow,
  red
}