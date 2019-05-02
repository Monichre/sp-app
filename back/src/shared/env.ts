import * as winston from 'winston'
import { TLogger } from '../fns/logger';

export const verifyEnv = <T>(envVars: T, log?: TLogger): T => {
  for (const key of Object.keys(envVars)) {
    if (!envVars[key]) { throw new Error(`No env var found for key ${key}`)}
  }
  if (log) { log.info('verified env vars', envVars) }
  return envVars
}