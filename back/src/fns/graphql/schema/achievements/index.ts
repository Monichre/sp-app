// @ts-nocheck
// @ts-ignore
import { makeExecutableSchema } from 'graphql-tools'

import {
  TableAchievement
} from '../../../../shared/tables/TableAchievement'

const typeDefs = `
type Query {
  getUserAchievements(pk: String!, uk: String!): [UserAchievement]
  getArtistAchievementHolders(perspectiveUID: String, artistId: String!): TopListenerData
  getTopArtistAchievementHolders(perspectiveUID: String, artistIds: [String]): [TopArtistAchievementHoldersResponse]
}


type Image {
  url: String!
}
type SpotifyUrl {
  spotify: String!
}


type TopArtistAchievementHoldersResponse {
  artistId: String
  achievementHolders: TopListenerData
}

type User {
  photoURL: String
  achievements: [String]
  uid: String
  email: String
  utcOffset: Int
  displayName: String
  lastUpdate: String
  sk: String
  totalUpdates: Int
  pk: String
  accessToken: String
  refreshToken: String
}


type TopListener {
  ak: String
  pk: String
  uk: String
  auk: String
  lastUpdated: String
  total: Float
  user: User
}

type TopListenerDataPeriod {
  first: UserAchievement
  second: UserAchievement
  third: UserAchievement
}

type TopListenerData {
  day: TopListenerDataPeriod
  week: TopListenerDataPeriod
  month: TopListenerDataPeriod
  life: TopListenerDataPeriod
}



type Artist {
  id: String!
  name: String!
  images: [Image!]!
  external_urls: SpotifyUrl!
  genres: [String!]!
  topListeners: TopListenerData
}


type UserAchievement {
	artist: Artist
	total: Int
	lastUpdated: String
	pk: String
	uk: String
	auk: String
	ak: String
	user: User
}

`
const getUserAchievements: any = async (
  _: any,
  {
    pk, uk
  }: any,
  { log, DYNAMO_ENDPOINT, TABLE_ACHIEVEMENT }: any
) => {
  const tableAchievement = TableAchievement(DYNAMO_ENDPOINT, TABLE_ACHIEVEMENT)
  const data = await tableAchievement.getUserAchievements(pk, uk)

  return data
}


const getArtistAchievementHolders = async (
  _: any,
  {
    perspectiveUID,
    artistId
  }: any,
  { log, DYNAMO_ENDPOINT, TABLE_ACHIEVEMENT }: any) => {
  console.log('TCL: artistId', artistId)
  const tableAchievement = TableAchievement(DYNAMO_ENDPOINT, TABLE_ACHIEVEMENT)
  const data: any = await tableAchievement.getArtistAchievementHoldersTimeSeries(perspectiveUID, artistId)
  console.log('TCL: data', data)

  return data

}



const getTopArtistAchievementHolders = async (
  _: any,
  { perspectiveUID, artistIds }: any,
  { log, DYNAMO_ENDPOINT, TABLE_ACHIEVEMENT }: any) => {

  console.log('TCL: artistIds', artistIds)


  const tableAchievement = TableAchievement(DYNAMO_ENDPOINT, TABLE_ACHIEVEMENT)

  const data: any = await Promise.all(artistIds.map(async (artistId: string) => ({ artistId, achievementHolders: await tableAchievement.getArtistAchievementHoldersTimeSeries(perspectiveUID, artistId) || [] })))

  console.log('TCL: getTopArtistAchievementHolders query resolver response: ', data)

  return data

}



getTopArtistAchievementHolders



const resolvers = {
  Query: {
    getUserAchievements,
    getArtistAchievementHolders,
    getTopArtistAchievementHolders
  }
}

export const achievementSchema = makeExecutableSchema({
  typeDefs,
  resolvers
})
