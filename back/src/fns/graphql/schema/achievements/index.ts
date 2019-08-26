// @ts-nocheck
// @ts-ignore
import { makeExecutableSchema } from 'graphql-tools'
import {
    QueryResolvers,
    UserInfoResponseResolvers,
    UserInfoResponse
} from '../../types'
import { TableUser } from '../../../../shared/tables/TableUser'
import {
    TableAchievement
} from '../../../../shared/tables/TableAchievement'

const typeDefs = `
type Query {
  getUserAchievements(pk: String!, uk: String!): [UserAchievement]
  getArtistAchievementHolders(artistId: String!): TopListenerData
}


type Image {
  url: String!
}
type SpotifyUrl {
  spotify: String!
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
        artistId
    },
    { log, DYNAMO_ENDPOINT, TABLE_ACHIEVEMENT }: any) => {
    console.log('TCL: artistId', artistId)
    const tableAchievement = TableAchievement(DYNAMO_ENDPOINT, TABLE_ACHIEVEMENT)
    const data: any = await tableAchievement.getArtistAchievementHoldersTimeSeries(artistId)
    console.log('TCL: data', data)

    return data

}





const resolvers = {
    Query: {
        getUserAchievements,
        getArtistAchievementHolders
    }
}

export const achievementSchema = makeExecutableSchema({
    typeDefs,
    resolvers
})
