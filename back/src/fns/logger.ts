import { createLogger, format, transports } from 'winston'

const handlerFormat = format(({awsEvent, handler, message, ...info}, opts) => ({
  ...info,
  message: `[${awsEvent || 'UNKNOWN AWS EVENT'}/${handler || 'UNKNOWN HANDLER'}] ${message}`
}))

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
  transports: [
    new transports.Console()
  ]
})
