import { makeExecutableSchema } from "graphql-tools";

const resolvers = {
  Query: {
    ping: () => ({ok: true})
  }
}

const typeDefs = `
type Query {
  _: String
  ping: BasicResponse
}
type Mutation {
  _: String
}

type BasicResponse {
  ok: Boolean
}
`

export const schema = makeExecutableSchema({typeDefs, resolvers})