import { Errors } from "io-ts";
import winston = require("winston");
import * as t from 'io-ts'
import { QueueValidationErrors } from "./queues";

export const errorPaths = (e: Errors) => e.map(ee => ee.context.map(({key}) => key).join('.'))

export const handleInvalid = async (log: winston.Logger, QueueUrl: string, errors: t.Errors, context: any = {}, uid = 'n/a') => {
  const paths = errorPaths(errors)
  log.error('validation failed', {paths, context, uid})
  await QueueValidationErrors.publish(QueueUrl, {
    uid,
    paths: errorPaths(errors),
    context
  })
}

export const decodeAll = <T>(decoder: t.Decoder<unknown, T>, items: any[]) => {
  const valids: T[] = []
  const invalids: { item: any, errors: t.Errors}[] = []
  for (const item of items) {
    const decoded = decoder.decode(item)
    if (decoded.isLeft()) {
      invalids.push({ item, errors: decoded.value})
    } else {
      valids.push(decoded.value)
    }
  }
  return { valids, invalids }
}

export const decodeOne = <T>(decoder: t.Decoder<unknown, T>, item: any) => {
  const decoded = decoder.decode(item)
  const valid = decoded.isRight() && decoded.value
  const invalid = decoded.isLeft() && { item, errors: decoded.value }
  return { valid, invalid }
}