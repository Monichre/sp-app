// Generated in 2019-08-16T20:48:56-04:00
// REGENERATE THIS BY STARTING THE LOCAL SERVER
// AND THEN RUNNING `back % yarn generate`

export type Maybe<T> = T | null;

// ====================================================
// Types
// ====================================================

export interface Query {
  getUserInfo: UserInfoResponse;

  getUserAchievements?: Maybe<(Maybe<UserAchievement>)[]>;

  _?: Maybe<string>;

  ping?: Maybe<BasicResponse>;

  recentPlays: RecentPlaysResponse;

  insightsStats: InsightsStatsResponse;

  insightsDash: InsightsDashResponse;

  insightsArtists: InsightsArtistsResponse;

  insightsGenres: InsightsGenresResponse;

  insightsArtistStats: InsightsArtistStatsResponse;

  insightsGenreStats: InsightsGenreStatsResponse;
}

export interface UserInfoResponse {
  uid: string;

  email: string;

  lastUpdate?: Maybe<string>;

  displayName?: Maybe<string>;

  photoURL?: Maybe<string>;

  initialHarvestComplete?: Maybe<boolean>;
}

export interface UserAchievement {
  artist?: Maybe<Artist>;

  total?: Maybe<number>;

  pk?: Maybe<string>;

  fk?: Maybe<string>;

  sk?: Maybe<string>;

  user?: Maybe<User>;
}

export interface Artist {
  id: string;

  name: string;

  images: Image[];

  external_urls: SpotifyUrl;

  genres: string[];

  topListeners?: Maybe<(Maybe<TopListener>)[]>;
}

export interface Image {
  url: string;
}

export interface SpotifyUrl {
  spotify: string;
}

export interface TopListener {
  sk?: Maybe<string>;

  pk?: Maybe<string>;

  total?: Maybe<number>;

  user?: Maybe<User>;
}

export interface User {
  photoURL?: Maybe<string>;

  uid?: Maybe<string>;

  email?: Maybe<string>;

  achievements?: Maybe<(Maybe<string>)[]>;

  utcOffset?: Maybe<number>;

  displayName?: Maybe<string>;

  lastUpdate?: Maybe<string>;

  sk?: Maybe<string>;

  totalUpdates?: Maybe<number>;

  pk?: Maybe<string>;

  accessToken?: Maybe<string>;

  refreshToken?: Maybe<string>;
}

export interface BasicResponse {
  ok?: Maybe<boolean>;
}

export interface RecentPlaysResponse {
  lastUpdate?: Maybe<string>;

  plays: Play[];
}

export interface Play {
  track: Track;

  playedAt: string;
}

export interface Track {
  name: string;

  artists: Artist[];

  album: Album;
}

export interface Album {
  name: string;

  images: (Maybe<Image>)[];
}

export interface InsightsStatsResponse {
  today: TimescopeStats;

  thisWeek: TimescopeStats;

  thisMonth: TimescopeStats;

  lifetime: TimescopeStats;
}

export interface TimescopeStats {
  timeseries: Timeseries;

  personal: PerspectiveStats;

  group: PerspectiveStats;
}

export interface Timeseries {
  label: string;

  values: TimeseriesValue[];
}

export interface TimeseriesValue {
  period: string;

  personal: number;

  group: number;
}

export interface PerspectiveStats {
  current: Duration;

  delta?: Maybe<Delta>;
}

export interface Duration {
  hrs: number;

  mins?: Maybe<number>;
}

export interface Delta {
  hrs: number;

  mins?: Maybe<number>;

  direction?: Maybe<string>;
}

export interface InsightsDashResponse {
  today: TimescopeTops;

  thisWeek: TimescopeTops;

  thisMonth: TimescopeTops;

  lifetime: TimescopeTops;
}

export interface TimescopeTops {
  timeSeries: Timeseries;

  personal: PerspectiveTops;

  group: PerspectiveTops;
}

export interface PerspectiveTops {
  artists: TopArtistStat[];

  genres: TopGenreStat[];
}

export interface TopArtistStat {
  personal: number;

  group: number;

  artist: Artist;
}

export interface TopGenreStat {
  personal: number;

  group: number;

  genre: string;
}

export interface InsightsArtistsResponse {
  today: TimescopeTopArtists;

  thisWeek: TimescopeTopArtists;

  thisMonth: TimescopeTopArtists;

  lifetime: TimescopeTopArtists;
}

export interface TimescopeTopArtists {
  personal: TopArtistStat[];

  group: TopArtistStat[];
}

export interface InsightsGenresResponse {
  today: TimescopeTopGenres;

  thisWeek: TimescopeTopGenres;

  thisMonth: TimescopeTopGenres;

  lifetime: TimescopeTopGenres;
}

export interface TimescopeTopGenres {
  personal: TopGenreStat[];

  group: TopGenreStat[];
}

export interface InsightsArtistStatsResponse {
  artist: Artist;

  today: TimescopeStats;

  thisWeek: TimescopeStats;

  thisMonth: TimescopeStats;

  lifetime: TimescopeStats;
}

export interface InsightsGenreStatsResponse {
  genre: string;

  today: TimescopeStats;

  thisWeek: TimescopeStats;

  thisMonth: TimescopeStats;

  lifetime: TimescopeStats;
}

export interface Mutation {
  _?: Maybe<string>;
}

// ====================================================
// Arguments
// ====================================================

export interface GetUserInfoQueryArgs {
  uid: string;
}
export interface GetUserAchievementsQueryArgs {
  pk: string;

  fk: string;
}
export interface RecentPlaysQueryArgs {
  uid: string;
}
export interface InsightsStatsQueryArgs {
  uid: string;

  gid: string;
}
export interface InsightsDashQueryArgs {
  uid: string;

  gid: string;
}
export interface InsightsArtistsQueryArgs {
  uid: string;

  gid: string;
}
export interface InsightsGenresQueryArgs {
  uid: string;

  gid: string;
}
export interface InsightsArtistStatsQueryArgs {
  uid: string;

  gid: string;

  artistId: string;
}
export interface InsightsGenreStatsQueryArgs {
  uid: string;

  gid: string;

  genre: string;
}

import { GraphQLResolveInfo } from "graphql";

import { Context } from "./graphql";

export type Resolver<Result, Parent = {}, TContext = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, TContext, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: TContext,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: TContext,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<
  Result,
  Parent = {},
  TContext = {},
  Args = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, TContext, Args>)
  | ISubscriptionResolverObject<Result, Parent, TContext, Args>;

export type TypeResolveFn<Types, Parent = {}, TContext = {}> = (
  parent: Parent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<Types>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export namespace QueryResolvers {
  export interface Resolvers<TContext = Context, TypeParent = {}> {
    getUserInfo?: GetUserInfoResolver<UserInfoResponse, TypeParent, TContext>;

    getUserAchievements?: GetUserAchievementsResolver<
      Maybe<(Maybe<UserAchievement>)[]>,
      TypeParent,
      TContext
    >;

    _?: _Resolver<Maybe<string>, TypeParent, TContext>;

    ping?: PingResolver<Maybe<BasicResponse>, TypeParent, TContext>;

    recentPlays?: RecentPlaysResolver<
      RecentPlaysResponse,
      TypeParent,
      TContext
    >;

    insightsStats?: InsightsStatsResolver<
      InsightsStatsResponse,
      TypeParent,
      TContext
    >;

    insightsDash?: InsightsDashResolver<
      InsightsDashResponse,
      TypeParent,
      TContext
    >;

    insightsArtists?: InsightsArtistsResolver<
      InsightsArtistsResponse,
      TypeParent,
      TContext
    >;

    insightsGenres?: InsightsGenresResolver<
      InsightsGenresResponse,
      TypeParent,
      TContext
    >;

    insightsArtistStats?: InsightsArtistStatsResolver<
      InsightsArtistStatsResponse,
      TypeParent,
      TContext
    >;

    insightsGenreStats?: InsightsGenreStatsResolver<
      InsightsGenreStatsResponse,
      TypeParent,
      TContext
    >;
  }

  export type GetUserInfoResolver<
    R = UserInfoResponse,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext, GetUserInfoArgs>;
  export interface GetUserInfoArgs {
    uid: string;
  }

  export type GetUserAchievementsResolver<
    R = Maybe<(Maybe<UserAchievement>)[]>,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext, GetUserAchievementsArgs>;
  export interface GetUserAchievementsArgs {
    pk: string;

    fk: string;
  }

  export type _Resolver<
    R = Maybe<string>,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PingResolver<
    R = Maybe<BasicResponse>,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type RecentPlaysResolver<
    R = RecentPlaysResponse,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext, RecentPlaysArgs>;
  export interface RecentPlaysArgs {
    uid: string;
  }

  export type InsightsStatsResolver<
    R = InsightsStatsResponse,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext, InsightsStatsArgs>;
  export interface InsightsStatsArgs {
    uid: string;

    gid: string;
  }

  export type InsightsDashResolver<
    R = InsightsDashResponse,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext, InsightsDashArgs>;
  export interface InsightsDashArgs {
    uid: string;

    gid: string;
  }

  export type InsightsArtistsResolver<
    R = InsightsArtistsResponse,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext, InsightsArtistsArgs>;
  export interface InsightsArtistsArgs {
    uid: string;

    gid: string;
  }

  export type InsightsGenresResolver<
    R = InsightsGenresResponse,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext, InsightsGenresArgs>;
  export interface InsightsGenresArgs {
    uid: string;

    gid: string;
  }

  export type InsightsArtistStatsResolver<
    R = InsightsArtistStatsResponse,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext, InsightsArtistStatsArgs>;
  export interface InsightsArtistStatsArgs {
    uid: string;

    gid: string;

    artistId: string;
  }

  export type InsightsGenreStatsResolver<
    R = InsightsGenreStatsResponse,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext, InsightsGenreStatsArgs>;
  export interface InsightsGenreStatsArgs {
    uid: string;

    gid: string;

    genre: string;
  }
}

export namespace UserInfoResponseResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = UserInfoResponse
  > {
    uid?: UidResolver<string, TypeParent, TContext>;

    email?: EmailResolver<string, TypeParent, TContext>;

    lastUpdate?: LastUpdateResolver<Maybe<string>, TypeParent, TContext>;

    displayName?: DisplayNameResolver<Maybe<string>, TypeParent, TContext>;

    photoURL?: PhotoUrlResolver<Maybe<string>, TypeParent, TContext>;

    initialHarvestComplete?: InitialHarvestCompleteResolver<
      Maybe<boolean>,
      TypeParent,
      TContext
    >;
  }

  export type UidResolver<
    R = string,
    Parent = UserInfoResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type EmailResolver<
    R = string,
    Parent = UserInfoResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type LastUpdateResolver<
    R = Maybe<string>,
    Parent = UserInfoResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type DisplayNameResolver<
    R = Maybe<string>,
    Parent = UserInfoResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PhotoUrlResolver<
    R = Maybe<string>,
    Parent = UserInfoResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type InitialHarvestCompleteResolver<
    R = Maybe<boolean>,
    Parent = UserInfoResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace UserAchievementResolvers {
  export interface Resolvers<TContext = Context, TypeParent = UserAchievement> {
    artist?: ArtistResolver<Maybe<Artist>, TypeParent, TContext>;

    total?: TotalResolver<Maybe<number>, TypeParent, TContext>;

    pk?: PkResolver<Maybe<string>, TypeParent, TContext>;

    fk?: FkResolver<Maybe<string>, TypeParent, TContext>;

    sk?: SkResolver<Maybe<string>, TypeParent, TContext>;

    user?: UserResolver<Maybe<User>, TypeParent, TContext>;
  }

  export type ArtistResolver<
    R = Maybe<Artist>,
    Parent = UserAchievement,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type TotalResolver<
    R = Maybe<number>,
    Parent = UserAchievement,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PkResolver<
    R = Maybe<string>,
    Parent = UserAchievement,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type FkResolver<
    R = Maybe<string>,
    Parent = UserAchievement,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type SkResolver<
    R = Maybe<string>,
    Parent = UserAchievement,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type UserResolver<
    R = Maybe<User>,
    Parent = UserAchievement,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace ArtistResolvers {
  export interface Resolvers<TContext = Context, TypeParent = Artist> {
    id?: IdResolver<string, TypeParent, TContext>;

    name?: NameResolver<string, TypeParent, TContext>;

    images?: ImagesResolver<Image[], TypeParent, TContext>;

    external_urls?: ExternalUrlsResolver<SpotifyUrl, TypeParent, TContext>;

    genres?: GenresResolver<string[], TypeParent, TContext>;

    topListeners?: TopListenersResolver<
      Maybe<(Maybe<TopListener>)[]>,
      TypeParent,
      TContext
    >;
  }

  export type IdResolver<
    R = string,
    Parent = Artist,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type NameResolver<
    R = string,
    Parent = Artist,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ImagesResolver<
    R = Image[],
    Parent = Artist,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ExternalUrlsResolver<
    R = SpotifyUrl,
    Parent = Artist,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type GenresResolver<
    R = string[],
    Parent = Artist,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type TopListenersResolver<
    R = Maybe<(Maybe<TopListener>)[]>,
    Parent = Artist,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace ImageResolvers {
  export interface Resolvers<TContext = Context, TypeParent = Image> {
    url?: UrlResolver<string, TypeParent, TContext>;
  }

  export type UrlResolver<
    R = string,
    Parent = Image,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace SpotifyUrlResolvers {
  export interface Resolvers<TContext = Context, TypeParent = SpotifyUrl> {
    spotify?: SpotifyResolver<string, TypeParent, TContext>;
  }

  export type SpotifyResolver<
    R = string,
    Parent = SpotifyUrl,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace TopListenerResolvers {
  export interface Resolvers<TContext = Context, TypeParent = TopListener> {
    sk?: SkResolver<Maybe<string>, TypeParent, TContext>;

    pk?: PkResolver<Maybe<string>, TypeParent, TContext>;

    total?: TotalResolver<Maybe<number>, TypeParent, TContext>;

    user?: UserResolver<Maybe<User>, TypeParent, TContext>;
  }

  export type SkResolver<
    R = Maybe<string>,
    Parent = TopListener,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PkResolver<
    R = Maybe<string>,
    Parent = TopListener,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type TotalResolver<
    R = Maybe<number>,
    Parent = TopListener,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type UserResolver<
    R = Maybe<User>,
    Parent = TopListener,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace UserResolvers {
  export interface Resolvers<TContext = Context, TypeParent = User> {
    photoURL?: PhotoUrlResolver<Maybe<string>, TypeParent, TContext>;

    uid?: UidResolver<Maybe<string>, TypeParent, TContext>;

    email?: EmailResolver<Maybe<string>, TypeParent, TContext>;

    achievements?: AchievementsResolver<
      Maybe<(Maybe<string>)[]>,
      TypeParent,
      TContext
    >;

    utcOffset?: UtcOffsetResolver<Maybe<number>, TypeParent, TContext>;

    displayName?: DisplayNameResolver<Maybe<string>, TypeParent, TContext>;

    lastUpdate?: LastUpdateResolver<Maybe<string>, TypeParent, TContext>;

    sk?: SkResolver<Maybe<string>, TypeParent, TContext>;

    totalUpdates?: TotalUpdatesResolver<Maybe<number>, TypeParent, TContext>;

    pk?: PkResolver<Maybe<string>, TypeParent, TContext>;

    accessToken?: AccessTokenResolver<Maybe<string>, TypeParent, TContext>;

    refreshToken?: RefreshTokenResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type PhotoUrlResolver<
    R = Maybe<string>,
    Parent = User,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type UidResolver<
    R = Maybe<string>,
    Parent = User,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type EmailResolver<
    R = Maybe<string>,
    Parent = User,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type AchievementsResolver<
    R = Maybe<(Maybe<string>)[]>,
    Parent = User,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type UtcOffsetResolver<
    R = Maybe<number>,
    Parent = User,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type DisplayNameResolver<
    R = Maybe<string>,
    Parent = User,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type LastUpdateResolver<
    R = Maybe<string>,
    Parent = User,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type SkResolver<
    R = Maybe<string>,
    Parent = User,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type TotalUpdatesResolver<
    R = Maybe<number>,
    Parent = User,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PkResolver<
    R = Maybe<string>,
    Parent = User,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type AccessTokenResolver<
    R = Maybe<string>,
    Parent = User,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type RefreshTokenResolver<
    R = Maybe<string>,
    Parent = User,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace BasicResponseResolvers {
  export interface Resolvers<TContext = Context, TypeParent = BasicResponse> {
    ok?: OkResolver<Maybe<boolean>, TypeParent, TContext>;
  }

  export type OkResolver<
    R = Maybe<boolean>,
    Parent = BasicResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace RecentPlaysResponseResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = RecentPlaysResponse
  > {
    lastUpdate?: LastUpdateResolver<Maybe<string>, TypeParent, TContext>;

    plays?: PlaysResolver<Play[], TypeParent, TContext>;
  }

  export type LastUpdateResolver<
    R = Maybe<string>,
    Parent = RecentPlaysResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PlaysResolver<
    R = Play[],
    Parent = RecentPlaysResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace PlayResolvers {
  export interface Resolvers<TContext = Context, TypeParent = Play> {
    track?: TrackResolver<Track, TypeParent, TContext>;

    playedAt?: PlayedAtResolver<string, TypeParent, TContext>;
  }

  export type TrackResolver<
    R = Track,
    Parent = Play,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PlayedAtResolver<
    R = string,
    Parent = Play,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace TrackResolvers {
  export interface Resolvers<TContext = Context, TypeParent = Track> {
    name?: NameResolver<string, TypeParent, TContext>;

    artists?: ArtistsResolver<Artist[], TypeParent, TContext>;

    album?: AlbumResolver<Album, TypeParent, TContext>;
  }

  export type NameResolver<
    R = string,
    Parent = Track,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ArtistsResolver<
    R = Artist[],
    Parent = Track,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type AlbumResolver<
    R = Album,
    Parent = Track,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace AlbumResolvers {
  export interface Resolvers<TContext = Context, TypeParent = Album> {
    name?: NameResolver<string, TypeParent, TContext>;

    images?: ImagesResolver<(Maybe<Image>)[], TypeParent, TContext>;
  }

  export type NameResolver<
    R = string,
    Parent = Album,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ImagesResolver<
    R = (Maybe<Image>)[],
    Parent = Album,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace InsightsStatsResponseResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = InsightsStatsResponse
  > {
    today?: TodayResolver<TimescopeStats, TypeParent, TContext>;

    thisWeek?: ThisWeekResolver<TimescopeStats, TypeParent, TContext>;

    thisMonth?: ThisMonthResolver<TimescopeStats, TypeParent, TContext>;

    lifetime?: LifetimeResolver<TimescopeStats, TypeParent, TContext>;
  }

  export type TodayResolver<
    R = TimescopeStats,
    Parent = InsightsStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ThisWeekResolver<
    R = TimescopeStats,
    Parent = InsightsStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ThisMonthResolver<
    R = TimescopeStats,
    Parent = InsightsStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type LifetimeResolver<
    R = TimescopeStats,
    Parent = InsightsStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace TimescopeStatsResolvers {
  export interface Resolvers<TContext = Context, TypeParent = TimescopeStats> {
    timeseries?: TimeseriesResolver<Timeseries, TypeParent, TContext>;

    personal?: PersonalResolver<PerspectiveStats, TypeParent, TContext>;

    group?: GroupResolver<PerspectiveStats, TypeParent, TContext>;
  }

  export type TimeseriesResolver<
    R = Timeseries,
    Parent = TimescopeStats,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PersonalResolver<
    R = PerspectiveStats,
    Parent = TimescopeStats,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type GroupResolver<
    R = PerspectiveStats,
    Parent = TimescopeStats,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace TimeseriesResolvers {
  export interface Resolvers<TContext = Context, TypeParent = Timeseries> {
    label?: LabelResolver<string, TypeParent, TContext>;

    values?: ValuesResolver<TimeseriesValue[], TypeParent, TContext>;
  }

  export type LabelResolver<
    R = string,
    Parent = Timeseries,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ValuesResolver<
    R = TimeseriesValue[],
    Parent = Timeseries,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace TimeseriesValueResolvers {
  export interface Resolvers<TContext = Context, TypeParent = TimeseriesValue> {
    period?: PeriodResolver<string, TypeParent, TContext>;

    personal?: PersonalResolver<number, TypeParent, TContext>;

    group?: GroupResolver<number, TypeParent, TContext>;
  }

  export type PeriodResolver<
    R = string,
    Parent = TimeseriesValue,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PersonalResolver<
    R = number,
    Parent = TimeseriesValue,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type GroupResolver<
    R = number,
    Parent = TimeseriesValue,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace PerspectiveStatsResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = PerspectiveStats
  > {
    current?: CurrentResolver<Duration, TypeParent, TContext>;

    delta?: DeltaResolver<Maybe<Delta>, TypeParent, TContext>;
  }

  export type CurrentResolver<
    R = Duration,
    Parent = PerspectiveStats,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type DeltaResolver<
    R = Maybe<Delta>,
    Parent = PerspectiveStats,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace DurationResolvers {
  export interface Resolvers<TContext = Context, TypeParent = Duration> {
    hrs?: HrsResolver<number, TypeParent, TContext>;

    mins?: MinsResolver<Maybe<number>, TypeParent, TContext>;
  }

  export type HrsResolver<
    R = number,
    Parent = Duration,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type MinsResolver<
    R = Maybe<number>,
    Parent = Duration,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace DeltaResolvers {
  export interface Resolvers<TContext = Context, TypeParent = Delta> {
    hrs?: HrsResolver<number, TypeParent, TContext>;

    mins?: MinsResolver<Maybe<number>, TypeParent, TContext>;

    direction?: DirectionResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type HrsResolver<
    R = number,
    Parent = Delta,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type MinsResolver<
    R = Maybe<number>,
    Parent = Delta,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type DirectionResolver<
    R = Maybe<string>,
    Parent = Delta,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace InsightsDashResponseResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = InsightsDashResponse
  > {
    today?: TodayResolver<TimescopeTops, TypeParent, TContext>;

    thisWeek?: ThisWeekResolver<TimescopeTops, TypeParent, TContext>;

    thisMonth?: ThisMonthResolver<TimescopeTops, TypeParent, TContext>;

    lifetime?: LifetimeResolver<TimescopeTops, TypeParent, TContext>;
  }

  export type TodayResolver<
    R = TimescopeTops,
    Parent = InsightsDashResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ThisWeekResolver<
    R = TimescopeTops,
    Parent = InsightsDashResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ThisMonthResolver<
    R = TimescopeTops,
    Parent = InsightsDashResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type LifetimeResolver<
    R = TimescopeTops,
    Parent = InsightsDashResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace TimescopeTopsResolvers {
  export interface Resolvers<TContext = Context, TypeParent = TimescopeTops> {
    timeSeries?: TimeSeriesResolver<Timeseries, TypeParent, TContext>;

    personal?: PersonalResolver<PerspectiveTops, TypeParent, TContext>;

    group?: GroupResolver<PerspectiveTops, TypeParent, TContext>;
  }

  export type TimeSeriesResolver<
    R = Timeseries,
    Parent = TimescopeTops,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PersonalResolver<
    R = PerspectiveTops,
    Parent = TimescopeTops,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type GroupResolver<
    R = PerspectiveTops,
    Parent = TimescopeTops,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace PerspectiveTopsResolvers {
  export interface Resolvers<TContext = Context, TypeParent = PerspectiveTops> {
    artists?: ArtistsResolver<TopArtistStat[], TypeParent, TContext>;

    genres?: GenresResolver<TopGenreStat[], TypeParent, TContext>;
  }

  export type ArtistsResolver<
    R = TopArtistStat[],
    Parent = PerspectiveTops,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type GenresResolver<
    R = TopGenreStat[],
    Parent = PerspectiveTops,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace TopArtistStatResolvers {
  export interface Resolvers<TContext = Context, TypeParent = TopArtistStat> {
    personal?: PersonalResolver<number, TypeParent, TContext>;

    group?: GroupResolver<number, TypeParent, TContext>;

    artist?: ArtistResolver<Artist, TypeParent, TContext>;
  }

  export type PersonalResolver<
    R = number,
    Parent = TopArtistStat,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type GroupResolver<
    R = number,
    Parent = TopArtistStat,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ArtistResolver<
    R = Artist,
    Parent = TopArtistStat,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace TopGenreStatResolvers {
  export interface Resolvers<TContext = Context, TypeParent = TopGenreStat> {
    personal?: PersonalResolver<number, TypeParent, TContext>;

    group?: GroupResolver<number, TypeParent, TContext>;

    genre?: GenreResolver<string, TypeParent, TContext>;
  }

  export type PersonalResolver<
    R = number,
    Parent = TopGenreStat,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type GroupResolver<
    R = number,
    Parent = TopGenreStat,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type GenreResolver<
    R = string,
    Parent = TopGenreStat,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace InsightsArtistsResponseResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = InsightsArtistsResponse
  > {
    today?: TodayResolver<TimescopeTopArtists, TypeParent, TContext>;

    thisWeek?: ThisWeekResolver<TimescopeTopArtists, TypeParent, TContext>;

    thisMonth?: ThisMonthResolver<TimescopeTopArtists, TypeParent, TContext>;

    lifetime?: LifetimeResolver<TimescopeTopArtists, TypeParent, TContext>;
  }

  export type TodayResolver<
    R = TimescopeTopArtists,
    Parent = InsightsArtistsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ThisWeekResolver<
    R = TimescopeTopArtists,
    Parent = InsightsArtistsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ThisMonthResolver<
    R = TimescopeTopArtists,
    Parent = InsightsArtistsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type LifetimeResolver<
    R = TimescopeTopArtists,
    Parent = InsightsArtistsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace TimescopeTopArtistsResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = TimescopeTopArtists
  > {
    personal?: PersonalResolver<TopArtistStat[], TypeParent, TContext>;

    group?: GroupResolver<TopArtistStat[], TypeParent, TContext>;
  }

  export type PersonalResolver<
    R = TopArtistStat[],
    Parent = TimescopeTopArtists,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type GroupResolver<
    R = TopArtistStat[],
    Parent = TimescopeTopArtists,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace InsightsGenresResponseResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = InsightsGenresResponse
  > {
    today?: TodayResolver<TimescopeTopGenres, TypeParent, TContext>;

    thisWeek?: ThisWeekResolver<TimescopeTopGenres, TypeParent, TContext>;

    thisMonth?: ThisMonthResolver<TimescopeTopGenres, TypeParent, TContext>;

    lifetime?: LifetimeResolver<TimescopeTopGenres, TypeParent, TContext>;
  }

  export type TodayResolver<
    R = TimescopeTopGenres,
    Parent = InsightsGenresResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ThisWeekResolver<
    R = TimescopeTopGenres,
    Parent = InsightsGenresResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ThisMonthResolver<
    R = TimescopeTopGenres,
    Parent = InsightsGenresResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type LifetimeResolver<
    R = TimescopeTopGenres,
    Parent = InsightsGenresResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace TimescopeTopGenresResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = TimescopeTopGenres
  > {
    personal?: PersonalResolver<TopGenreStat[], TypeParent, TContext>;

    group?: GroupResolver<TopGenreStat[], TypeParent, TContext>;
  }

  export type PersonalResolver<
    R = TopGenreStat[],
    Parent = TimescopeTopGenres,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type GroupResolver<
    R = TopGenreStat[],
    Parent = TimescopeTopGenres,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace InsightsArtistStatsResponseResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = InsightsArtistStatsResponse
  > {
    artist?: ArtistResolver<Artist, TypeParent, TContext>;

    today?: TodayResolver<TimescopeStats, TypeParent, TContext>;

    thisWeek?: ThisWeekResolver<TimescopeStats, TypeParent, TContext>;

    thisMonth?: ThisMonthResolver<TimescopeStats, TypeParent, TContext>;

    lifetime?: LifetimeResolver<TimescopeStats, TypeParent, TContext>;
  }

  export type ArtistResolver<
    R = Artist,
    Parent = InsightsArtistStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type TodayResolver<
    R = TimescopeStats,
    Parent = InsightsArtistStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ThisWeekResolver<
    R = TimescopeStats,
    Parent = InsightsArtistStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ThisMonthResolver<
    R = TimescopeStats,
    Parent = InsightsArtistStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type LifetimeResolver<
    R = TimescopeStats,
    Parent = InsightsArtistStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace InsightsGenreStatsResponseResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = InsightsGenreStatsResponse
  > {
    genre?: GenreResolver<string, TypeParent, TContext>;

    today?: TodayResolver<TimescopeStats, TypeParent, TContext>;

    thisWeek?: ThisWeekResolver<TimescopeStats, TypeParent, TContext>;

    thisMonth?: ThisMonthResolver<TimescopeStats, TypeParent, TContext>;

    lifetime?: LifetimeResolver<TimescopeStats, TypeParent, TContext>;
  }

  export type GenreResolver<
    R = string,
    Parent = InsightsGenreStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type TodayResolver<
    R = TimescopeStats,
    Parent = InsightsGenreStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ThisWeekResolver<
    R = TimescopeStats,
    Parent = InsightsGenreStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type ThisMonthResolver<
    R = TimescopeStats,
    Parent = InsightsGenreStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type LifetimeResolver<
    R = TimescopeStats,
    Parent = InsightsGenreStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace MutationResolvers {
  export interface Resolvers<TContext = Context, TypeParent = {}> {
    _?: _Resolver<Maybe<string>, TypeParent, TContext>;
  }

  export type _Resolver<
    R = Maybe<string>,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  Context
>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  Context
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  Context
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string;
}

export type IResolvers<TContext = Context> = {
  Query?: QueryResolvers.Resolvers<TContext>;
  UserInfoResponse?: UserInfoResponseResolvers.Resolvers<TContext>;
  UserAchievement?: UserAchievementResolvers.Resolvers<TContext>;
  Artist?: ArtistResolvers.Resolvers<TContext>;
  Image?: ImageResolvers.Resolvers<TContext>;
  SpotifyUrl?: SpotifyUrlResolvers.Resolvers<TContext>;
  TopListener?: TopListenerResolvers.Resolvers<TContext>;
  User?: UserResolvers.Resolvers<TContext>;
  BasicResponse?: BasicResponseResolvers.Resolvers<TContext>;
  RecentPlaysResponse?: RecentPlaysResponseResolvers.Resolvers<TContext>;
  Play?: PlayResolvers.Resolvers<TContext>;
  Track?: TrackResolvers.Resolvers<TContext>;
  Album?: AlbumResolvers.Resolvers<TContext>;
  InsightsStatsResponse?: InsightsStatsResponseResolvers.Resolvers<TContext>;
  TimescopeStats?: TimescopeStatsResolvers.Resolvers<TContext>;
  Timeseries?: TimeseriesResolvers.Resolvers<TContext>;
  TimeseriesValue?: TimeseriesValueResolvers.Resolvers<TContext>;
  PerspectiveStats?: PerspectiveStatsResolvers.Resolvers<TContext>;
  Duration?: DurationResolvers.Resolvers<TContext>;
  Delta?: DeltaResolvers.Resolvers<TContext>;
  InsightsDashResponse?: InsightsDashResponseResolvers.Resolvers<TContext>;
  TimescopeTops?: TimescopeTopsResolvers.Resolvers<TContext>;
  PerspectiveTops?: PerspectiveTopsResolvers.Resolvers<TContext>;
  TopArtistStat?: TopArtistStatResolvers.Resolvers<TContext>;
  TopGenreStat?: TopGenreStatResolvers.Resolvers<TContext>;
  InsightsArtistsResponse?: InsightsArtistsResponseResolvers.Resolvers<
    TContext
  >;
  TimescopeTopArtists?: TimescopeTopArtistsResolvers.Resolvers<TContext>;
  InsightsGenresResponse?: InsightsGenresResponseResolvers.Resolvers<TContext>;
  TimescopeTopGenres?: TimescopeTopGenresResolvers.Resolvers<TContext>;
  InsightsArtistStatsResponse?: InsightsArtistStatsResponseResolvers.Resolvers<
    TContext
  >;
  InsightsGenreStatsResponse?: InsightsGenreStatsResponseResolvers.Resolvers<
    TContext
  >;
  Mutation?: MutationResolvers.Resolvers<TContext>;
} & { [typeName: string]: never };

export type IDirectiveResolvers<Result> = {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
} & { [directiveName: string]: never };
