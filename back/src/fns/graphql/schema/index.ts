import { schema as user } from './user'
import { schema as ping } from './ping'
import { mergeSchemas } from 'graphql-tools';

export const schema = mergeSchemas({schemas: [
  user,
  ping,
]})