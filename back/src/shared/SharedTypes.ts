import { UpdateItemOutput } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'
import { AWSError, Response } from 'aws-sdk'
import { User } from '../fns/graphql/types';


export type Stat = {

	uid: string
	relationType: RelationType
	relationKey: string
	periodType: PeriodType
	periodValue: string
	playDurationMs: number
}

export type StatTotal = Stat
export type StatArtist = Stat & {
	artist: { name: string; genres: string[] }
}

export type StatGenre = Stat & {
	genre: string
}

export type EnrichedKeyMakerParams = {
	relationType: 'artist'
	periodType: PeriodType
	periodValue: string
	artistId: string
	achievementType: 'topListener'
	achievementValue: 'first' | 'second' | 'third'
	uid?: string | null
}

export type UserTopRecordArtistStat = {
	recordKeys: {
		pk: string
		sk: string
		fk: string
	}
	user: User
	dayData: number
	weekData: number
	monthData: number
	lifeData: number
	lastUpdated: string
}


export type Artist = {
	id: string
	name: string
	images: Image[]
	external_urls: SpotifyUrl
	genres: string[]
	topListeners?: Object[]
}

export type SpotifyUrl = {
	spotify: string
}
export type Image = {
	url: string
}

export type Relation = '#user' | '#artist'


export type StatRecordTopListenerDataWithUserId = {
	artistAchievementsId: string
	pk: string
	sk: string
	userId: string
	artist: Artist
	total: number
}

export type StatRecordTopListenerDataWithUser = {
	artistAchievementsId: string
	pk: string
	sk: string
	user: User
	artist: Artist
	total: number
	lastUpdated: string
}

export type CreateAchievementRecordDataParams = {
	user: User
	artist: Artist
	total: number
	lastUpdated: string
}

export type StatRecordPreAchievementData = {
	topListenerData: StatRecordTopListenerDataWithUser
	index: number
	tableAchievement: TTableAchievement
}

export type TopArtistsRow = {
	artist: Artist
	playDurationMs: number
}


export type PeriodType =
	| 'day'
	| 'dow'
	| 'week'
	| 'month'
	| 'moy'
	| 'year'
	| 'life'



export type RelationType = 'total' | 'artist' | 'genre' | 'user'

export type ArtistStatKeys = {
	uid: string
	artistId: string
	periodType: PeriodType
	periodValue: string
}

export type AchievementType = 'topListener' | 'firstToStream' | '#topListener' | '#firstToStream'

export type AchievementValue = 'first' | 'second' | 'third' | '#first' | '#second' | '#third'

export type AchievementRecord = {
	ak: AchievementKeys['ak']
	pk: AchievementKeys['pk']
	auk: AchievementKeys['auk']
	uk: AchievementKeys['uk']
	total: number
	lastUpdated: string
	user: User
	artist: Artist
}

export type GetUserAchievementItem = {
	lastUpdated: any
	total: number
	fk: string
	artist: any
	sk: string
	pk: string
	user: any
}

export type AchievementTotal = number
export type AchievementArtist = Achievement & {
	artist: { name: string; id: string }
	playDurationMs: number
}

export type UserAchievementByArtistParams = {
	aglPK: string
	userFK: string
}

export type KeyData = {
	sk: string
	pk: string
	fk?: string
}
export type GenreImage = {
	genre: { S: string }
	sk: { S: string }
	pk: { S: string }
	playDurationMs: { N: string }
}

export type ArtistImage = {
	artist: {
		M: {
			images: any[]
			genres: any[]
			name: any[]
			id: any[]
			external_urls: any[]
		}
	}
	sk: {
		S: string
	}
	pk: {
		S: string
	}
	playDurationMs: {
		N: string
	}
}


export type TopListenerParameterType = KeyData & {}

export type TimeseriesKeys = {
	uid: string
	relationType: RelationType
	relationId: string
	periodType: PeriodType
	startPeriod: string
	endPeriod: string
}
export type Timeseries = {
	playDurationMs: number
	period: string
}

export type StatRecordPreAchievementMetaDataKeyParams = {
	perspectiveUID: 'global' | 'personal'
	sk: string
	pk: string
	artist: Artist
	artistAchievementsId: string
	achievementType: string
	achievementValue: string
}


export type AchievementRetrievalKeys = {
	perspectiveUID: 'global' | 'personal'
	periodType: PeriodType
	periodValue: string
	artistId: Artist["id"]
	achievementType: AchievementType
	achievementValue: AchievementValue
}

export type AchievementKeys = {
	pk: string // partition key
	uk: string // user key
	auk: string // artist + user key
	ak: string // artist key
}

export type AchievementCreationKeys = {
	pk: string // partition key
	uk: string // user key
	auk: string // artist + user key
	ak: string // artist key
}

export type AKKeyRetrievalData = {
	perspectiveUID: 'global' | 'personal'
	periodType: PeriodType
	periodValue: string
	artistId: Artist["id"]
	achievementType: AchievementType
	achievementValue: AchievementValue
}

export type ArtistAchievementRetrievalKeys = {
	pk: AchievementCreationKeys["pk"]
	ak: AchievementCreationKeys["ak"]
	auk?: AchievementCreationKeys["auk"]
}


// export type TAGL = {
// 	indexToAchievementMap: {
// 		0: 'first'
// 		1: 'second'
// 		2: 'third'
// 	}

// // extractPeriodTypeAndValue
// 	enrichAndRecordAchievement: (args: StatRecordPreAchievementData) => AchievementRecord
// }


export type TTableAchievement = {
	makeAchievementCreationKeys: (args: StatRecordPreAchievementMetaDataKeyParams) => AchievementCreationKeys


	// makeAchievementRetrievalKeys

	getArtistAchievementHoldersTimeSeries: (perspectiveUID: string, artistId: Artist['id']) => Promise<PromiseResult<any, AWSError>>

	makeAKRetrievalKeys: (args: AKKeyRetrievalData) => ArtistAchievementRetrievalKeys

	periodsFor: (
		isoDateString: string
	) => {
		day: string
		dow: string
		week: string
		month: string
		moy: string
		year: string
		life: string
	}
	// getTimeseries: (timeseriesKeys: TimeseriesKeys) => Promise<Timeseries[]>

	createOrModifyAchievement: (
		keyData: AchievementCreationKeys,
		achievementData: CreateAchievementRecordDataParams
	) => Promise<PromiseResult<AchievementRecord, AWSError>>

	getArtistAchievementHolders: ({
		pk,
		ak
	}: ArtistAchievementRetrievalKeys) => Promise<PromiseResult<any, AWSError>>

	getUserAchievements: (
		pk: string,
		fk: string
	) => Promise<
		PromiseResult<
			any | [GetUserAchievementItem] | GetUserAchievementItem,
			AWSError
		>
	>
}

