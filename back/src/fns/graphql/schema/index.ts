import { mergeSchemas } from 'graphql-tools';

import { schema as user } from './user'
import { schema as ping } from './ping'
import { schema as play } from './play'
import { statSchema } from './stat/index'
import { achievementSchema } from './achievements'

export const schema = mergeSchemas({schemas: [
  user,
  ping,
  play,
  statSchema,
  achievementSchema
]})