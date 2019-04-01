import { mergeSchemas } from 'graphql-tools';

import { schema as user } from './user'
import { schema as ping } from './ping'
import { schema as play } from './play'
import { schema as stat } from './stat'

export const schema = mergeSchemas({schemas: [
  user,
  ping,
  play,
  stat,
]})