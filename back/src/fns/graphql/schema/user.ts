import { makeExecutableSchema } from "graphql-tools";
import { MutationResolvers } from "../types";

// btw none of this is actually used anywhere

const typeDefs = `
type Query {
  dummy: String
}

type Mutation {
  onLogin(user: FirebaseUser!): BasicResponse
  updateSpotifyAuth(userId: String!, creds: SpotifyCredentials): BasicResponse
}

type BasicResponse {
  ok: Boolean
}

input FirebaseUser {
  uid: String!
  displayName: String
  photoURL: String
  email: String
  emailVerified: Boolean!
  phoneNumber: String
  isAnonymous: Boolean!
  providerData: [FirebaseUserProviderData]!
}

input FirebaseUserProviderData {
  uid: String!
  displayName: String
  photoURL: String
  email: String
  phoneNumber: String
  providerId: String!
}

input SpotifyCredentials {
  spotifyId: String!
  accessToken: String!
  refreshToken: String!
}
`

const onLogin: MutationResolvers.OnLoginResolver = async (_, {user}) => {
  console.log('login with user', user)
  return { ok: true }
}

const updateSpotifyAuth: MutationResolvers.UpdateSpotifyAuthResolver = async (_, {userId, creds}) => {
  console.log('update creds for', userId, creds)
  return { ok: true }
}

const resolvers = {
  Mutation: {
    onLogin,
    updateSpotifyAuth,
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})