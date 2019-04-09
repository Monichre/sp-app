import { createLogger, format, transports } from 'winston'

const handlerFormat = format(({awsEvent, handler, message, ...info}, opts) => ({
  ...info,
  message: `[${awsEvent || 'UNKNOWN AWS EVENT'}/${handler || 'UNKNOWN HANDLER'}] ${message}`
}))

console.log('TARGET', process.env.TARGET)
const transp = process.env.TARGET==null ? // if null its local
  [new transports.Console(), new transports.File({ filename: 'local.log' })] :
  [new transports.Console()]

export const slog = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json({ space: 2 }),
    handlerFormat(),
    format.colorize(),
    format.simple(),
),
  transports: transp
})
