import { createLogger, format, transports } from 'winston'

const handlerFormat = format(({awsEvent, handler, message, ...info}, opts) => ({
  ...info,
  message: `[${awsEvent || 'UNKNOWN AWS EVENT'}/${handler || 'UNKNOWN HANDLER'}] ${message}`
}))

// this should switch on local/cloud flag
// const transp = process.env.TARGET==null ? // if null its local
//   [new transports.Console(), new transports.File({ filename: 'local.log' })] :
//   [new transports.Console()]

// export const slog = createLogger({
//   level: 'info',
//   format: format.combine(
//     format.timestamp({
//       format: 'YYYY-MM-DD HH:mm:ss'
//     }),
//     format.errors({ stack: true }),
//     format.splat(),
//     format.json({ space: 2 }),
//     handlerFormat(),
//     format.colorize(),
//     format.simple(),
// ),
//   transports: transp
// })

const LOCAL_OPTIONS = {
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json({ space: 2 }),
    handlerFormat(),
    format.colorize(),
    format.simple(),
  ),
  transports: []
}

const CLOUD_OPTIONS = {
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json({ space: 2 }),
    handlerFormat(),
    format.simple(),
  ),
  transports: []
}

// export const makeLogger = ({awsEvent, handler}) => {
//   const isLocal = process.env.TARGET === null
//   const options = isLocal ? LOCAL_OPTIONS : CLOUD_OPTIONS
//   options.transports.push(new transports.Console())
//   if (isLocal) { options.transports.push(new transports.File({ filename: 'local.log' })) }

//   const winston = createLogger(options)
//   return winston.child({awsEvent, handler})
// }

export const makeLogger = ({awsEvent, handler}): TLogger => {
  // fuck you winston
  // const isLocal = process.env.TARGET === null
  const isLocal = false
  if (isLocal) {
    const options = isLocal ? LOCAL_OPTIONS : CLOUD_OPTIONS
    options.transports.push(new transports.Console())
    if (isLocal) { options.transports.push(new transports.File({ filename: 'local.log' })) }
  
    const winston = createLogger(options)
    return winston.child({awsEvent, handler})  
  } else {
    return {
      debug: (...args) => console.log('debug', awsEvent, handler, ...args),
      info: (...args) => console.log('info', awsEvent, handler, ...args),
      warn: (...args) => console.log('warn', awsEvent, handler, ...args),
      error: (...args) => console.log('error', awsEvent, handler, ...args),
      close: () => {},
    }
  }
}

export type TLogger = {
  debug: (...args: any[]) => void
  info: (...args: any[]) => void
  warn: (...args: any[]) => void
  error: (...args: any[]) => void
  close: () => void
}