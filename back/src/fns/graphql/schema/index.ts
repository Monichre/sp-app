import { mergeSchemas } from 'graphql-tools';

import { schema as user } from './user'
import { schema as ping } from './ping'
import { schema as play } from './play'

export const schema = mergeSchemas({schemas: [
  user,
  ping,
  play,
]})