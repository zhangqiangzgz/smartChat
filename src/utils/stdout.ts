import kleur from "kleur"

const log = (message: string): unknown => {
  return console.log(message)
}

const error = (message: string): unknown => {
  return console.error(kleur.bold().red().italic(message))
}

const info = (message: string): unknown => {
  return console.info(kleur.bold().blue().italic(message))
}

const warn = (message: string): unknown => {
  return console.warn(kleur.bold().yellow().italic(message))
}
const success = (message: string): unknown => {
  return console.log(kleur.bold().green().italic(message))
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
  error,
  info,
  warn,
  success,
  green,
  blue,
  yellow,
  red
}