// Generated in 2019-04-09T22:32:59-07:00
// REGENERATE THIS BY STARTING THE LOCAL SERVER
// AND THEN RUNNING `back % yarn generate`

export type Maybe<T> = T | null;

export interface FirebaseUser {
  uid: string;

  displayName?: Maybe<string>;

  photoURL?: Maybe<string>;

  email?: Maybe<string>;

  emailVerified: boolean;

  phoneNumber?: Maybe<string>;

  isAnonymous: boolean;

  providerData: (Maybe<FirebaseUserProviderData>)[];
}

export interface FirebaseUserProviderData {
  uid: string;

  displayName?: Maybe<string>;

  photoURL?: Maybe<string>;

  email?: Maybe<string>;

  phoneNumber?: Maybe<string>;

  providerId: string;
}

export interface SpotifyCredentials {
  spotifyId: string;

  accessToken: string;

  refreshToken: string;
}

// ====================================================
// Types
// ====================================================

export interface Query {
  dummy?: Maybe<string>;

  _?: Maybe<string>;

  ping?: Maybe<BasicResponse>;

  recentPlays: RecentPlaysResponse;

  playtimeSummary: PlaytimeSummaryResponse;

  dashStats: DashStatsResponse;

  artistStats: ArtistStatsResponse;
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

export interface Artist {
  id: string;

  name: string;

  images: Image[];

  external_urls: SpotifyUrl;

  genres: string[];
}

export interface Image {
  url: string;
}

export interface SpotifyUrl {
  spotify: string;
}

export interface Album {
  name: string;

  images: (Maybe<Image>)[];
}

export interface PlaytimeSummaryResponse {
  topLifetimeArtists: ArtistPlaytime[];

  day: PlaytimeSummaryPeriods;

  week: PlaytimeSummaryPeriods;

  month: PlaytimeSummaryPeriods;
}

export interface ArtistPlaytime {
  artist: Artist;

  playDurationMs: number;
}

export interface PlaytimeSummaryPeriods {
  current: number;

  prev: number;
}

export interface DashStatsResponse {
  topArtists: UserArtistPlaytimes;

  topGenres: UserGenrePlaytimes;
}

export interface UserArtistPlaytimes {
  week: PeriodGlobalUserArtistPlaytimes;

  month: PeriodGlobalUserArtistPlaytimes;

  life: PeriodGlobalUserArtistPlaytimes;
}

export interface PeriodGlobalUserArtistPlaytimes {
  global: ArtistPlaytime[];

  user: ArtistPlaytime[];
}

export interface UserGenrePlaytimes {
  week: UserGenrePeriodPlaytimes;

  month: UserGenrePeriodPlaytimes;

  life: UserGenrePeriodPlaytimes;
}

export interface UserGenrePeriodPlaytimes {
  global: GenrePlaytime[];

  user: GenrePlaytime[];
}

export interface GenrePlaytime {
  name: string;

  playDurationMs: number;
}

export interface ArtistStatsResponse {
  artist: Artist;

  past30d: ArtistStatsPeriod;

  past12w: ArtistStatsPeriod;
}

export interface ArtistStatsPeriod {
  global: ArtistStatsPeriodUser[];

  personal: ArtistStatsPeriodUser[];
}

export interface ArtistStatsPeriodUser {
  period: string;

  playDurationMs: number;
}

export interface Mutation {
  onLogin?: Maybe<BasicResponse>;

  updateSpotifyAuth?: Maybe<BasicResponse>;

  _?: Maybe<string>;
}

// ====================================================
// Arguments
// ====================================================

export interface RecentPlaysQueryArgs {
  uid: string;
}
export interface PlaytimeSummaryQueryArgs {
  uid: string;
}
export interface DashStatsQueryArgs {
  uid: string;
}
export interface ArtistStatsQueryArgs {
  uid: string;

  id: string;
}
export interface OnLoginMutationArgs {
  user: FirebaseUser;
}
export interface UpdateSpotifyAuthMutationArgs {
  userId: string;

  creds?: Maybe<SpotifyCredentials>;
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
    dummy?: DummyResolver<Maybe<string>, TypeParent, TContext>;

    _?: _Resolver<Maybe<string>, TypeParent, TContext>;

    ping?: PingResolver<Maybe<BasicResponse>, TypeParent, TContext>;

    recentPlays?: RecentPlaysResolver<
      RecentPlaysResponse,
      TypeParent,
      TContext
    >;

    playtimeSummary?: PlaytimeSummaryResolver<
      PlaytimeSummaryResponse,
      TypeParent,
      TContext
    >;

    dashStats?: DashStatsResolver<DashStatsResponse, TypeParent, TContext>;

    artistStats?: ArtistStatsResolver<
      ArtistStatsResponse,
      TypeParent,
      TContext
    >;
  }

  export type DummyResolver<
    R = Maybe<string>,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext>;
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

  export type PlaytimeSummaryResolver<
    R = PlaytimeSummaryResponse,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext, PlaytimeSummaryArgs>;
  export interface PlaytimeSummaryArgs {
    uid: string;
  }

  export type DashStatsResolver<
    R = DashStatsResponse,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext, DashStatsArgs>;
  export interface DashStatsArgs {
    uid: string;
  }

  export type ArtistStatsResolver<
    R = ArtistStatsResponse,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext, ArtistStatsArgs>;
  export interface ArtistStatsArgs {
    uid: string;

    id: string;
  }
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

export namespace ArtistResolvers {
  export interface Resolvers<TContext = Context, TypeParent = Artist> {
    id?: IdResolver<string, TypeParent, TContext>;

    name?: NameResolver<string, TypeParent, TContext>;

    images?: ImagesResolver<Image[], TypeParent, TContext>;

    external_urls?: ExternalUrlsResolver<SpotifyUrl, TypeParent, TContext>;

    genres?: GenresResolver<string[], TypeParent, TContext>;
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

export namespace PlaytimeSummaryResponseResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = PlaytimeSummaryResponse
  > {
    topLifetimeArtists?: TopLifetimeArtistsResolver<
      ArtistPlaytime[],
      TypeParent,
      TContext
    >;

    day?: DayResolver<PlaytimeSummaryPeriods, TypeParent, TContext>;

    week?: WeekResolver<PlaytimeSummaryPeriods, TypeParent, TContext>;

    month?: MonthResolver<PlaytimeSummaryPeriods, TypeParent, TContext>;
  }

  export type TopLifetimeArtistsResolver<
    R = ArtistPlaytime[],
    Parent = PlaytimeSummaryResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type DayResolver<
    R = PlaytimeSummaryPeriods,
    Parent = PlaytimeSummaryResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type WeekResolver<
    R = PlaytimeSummaryPeriods,
    Parent = PlaytimeSummaryResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type MonthResolver<
    R = PlaytimeSummaryPeriods,
    Parent = PlaytimeSummaryResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace ArtistPlaytimeResolvers {
  export interface Resolvers<TContext = Context, TypeParent = ArtistPlaytime> {
    artist?: ArtistResolver<Artist, TypeParent, TContext>;

    playDurationMs?: PlayDurationMsResolver<number, TypeParent, TContext>;
  }

  export type ArtistResolver<
    R = Artist,
    Parent = ArtistPlaytime,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PlayDurationMsResolver<
    R = number,
    Parent = ArtistPlaytime,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace PlaytimeSummaryPeriodsResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = PlaytimeSummaryPeriods
  > {
    current?: CurrentResolver<number, TypeParent, TContext>;

    prev?: PrevResolver<number, TypeParent, TContext>;
  }

  export type CurrentResolver<
    R = number,
    Parent = PlaytimeSummaryPeriods,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PrevResolver<
    R = number,
    Parent = PlaytimeSummaryPeriods,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace DashStatsResponseResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = DashStatsResponse
  > {
    topArtists?: TopArtistsResolver<UserArtistPlaytimes, TypeParent, TContext>;

    topGenres?: TopGenresResolver<UserGenrePlaytimes, TypeParent, TContext>;
  }

  export type TopArtistsResolver<
    R = UserArtistPlaytimes,
    Parent = DashStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type TopGenresResolver<
    R = UserGenrePlaytimes,
    Parent = DashStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace UserArtistPlaytimesResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = UserArtistPlaytimes
  > {
    week?: WeekResolver<PeriodGlobalUserArtistPlaytimes, TypeParent, TContext>;

    month?: MonthResolver<
      PeriodGlobalUserArtistPlaytimes,
      TypeParent,
      TContext
    >;

    life?: LifeResolver<PeriodGlobalUserArtistPlaytimes, TypeParent, TContext>;
  }

  export type WeekResolver<
    R = PeriodGlobalUserArtistPlaytimes,
    Parent = UserArtistPlaytimes,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type MonthResolver<
    R = PeriodGlobalUserArtistPlaytimes,
    Parent = UserArtistPlaytimes,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type LifeResolver<
    R = PeriodGlobalUserArtistPlaytimes,
    Parent = UserArtistPlaytimes,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace PeriodGlobalUserArtistPlaytimesResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = PeriodGlobalUserArtistPlaytimes
  > {
    global?: GlobalResolver<ArtistPlaytime[], TypeParent, TContext>;

    user?: UserResolver<ArtistPlaytime[], TypeParent, TContext>;
  }

  export type GlobalResolver<
    R = ArtistPlaytime[],
    Parent = PeriodGlobalUserArtistPlaytimes,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type UserResolver<
    R = ArtistPlaytime[],
    Parent = PeriodGlobalUserArtistPlaytimes,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace UserGenrePlaytimesResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = UserGenrePlaytimes
  > {
    week?: WeekResolver<UserGenrePeriodPlaytimes, TypeParent, TContext>;

    month?: MonthResolver<UserGenrePeriodPlaytimes, TypeParent, TContext>;

    life?: LifeResolver<UserGenrePeriodPlaytimes, TypeParent, TContext>;
  }

  export type WeekResolver<
    R = UserGenrePeriodPlaytimes,
    Parent = UserGenrePlaytimes,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type MonthResolver<
    R = UserGenrePeriodPlaytimes,
    Parent = UserGenrePlaytimes,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type LifeResolver<
    R = UserGenrePeriodPlaytimes,
    Parent = UserGenrePlaytimes,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace UserGenrePeriodPlaytimesResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = UserGenrePeriodPlaytimes
  > {
    global?: GlobalResolver<GenrePlaytime[], TypeParent, TContext>;

    user?: UserResolver<GenrePlaytime[], TypeParent, TContext>;
  }

  export type GlobalResolver<
    R = GenrePlaytime[],
    Parent = UserGenrePeriodPlaytimes,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type UserResolver<
    R = GenrePlaytime[],
    Parent = UserGenrePeriodPlaytimes,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace GenrePlaytimeResolvers {
  export interface Resolvers<TContext = Context, TypeParent = GenrePlaytime> {
    name?: NameResolver<string, TypeParent, TContext>;

    playDurationMs?: PlayDurationMsResolver<number, TypeParent, TContext>;
  }

  export type NameResolver<
    R = string,
    Parent = GenrePlaytime,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PlayDurationMsResolver<
    R = number,
    Parent = GenrePlaytime,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace ArtistStatsResponseResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = ArtistStatsResponse
  > {
    artist?: ArtistResolver<Artist, TypeParent, TContext>;

    past30d?: Past30dResolver<ArtistStatsPeriod, TypeParent, TContext>;

    past12w?: Past12wResolver<ArtistStatsPeriod, TypeParent, TContext>;
  }

  export type ArtistResolver<
    R = Artist,
    Parent = ArtistStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type Past30dResolver<
    R = ArtistStatsPeriod,
    Parent = ArtistStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type Past12wResolver<
    R = ArtistStatsPeriod,
    Parent = ArtistStatsResponse,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace ArtistStatsPeriodResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = ArtistStatsPeriod
  > {
    global?: GlobalResolver<ArtistStatsPeriodUser[], TypeParent, TContext>;

    personal?: PersonalResolver<ArtistStatsPeriodUser[], TypeParent, TContext>;
  }

  export type GlobalResolver<
    R = ArtistStatsPeriodUser[],
    Parent = ArtistStatsPeriod,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PersonalResolver<
    R = ArtistStatsPeriodUser[],
    Parent = ArtistStatsPeriod,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace ArtistStatsPeriodUserResolvers {
  export interface Resolvers<
    TContext = Context,
    TypeParent = ArtistStatsPeriodUser
  > {
    period?: PeriodResolver<string, TypeParent, TContext>;

    playDurationMs?: PlayDurationMsResolver<number, TypeParent, TContext>;
  }

  export type PeriodResolver<
    R = string,
    Parent = ArtistStatsPeriodUser,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
  export type PlayDurationMsResolver<
    R = number,
    Parent = ArtistStatsPeriodUser,
    TContext = Context
  > = Resolver<R, Parent, TContext>;
}

export namespace MutationResolvers {
  export interface Resolvers<TContext = Context, TypeParent = {}> {
    onLogin?: OnLoginResolver<Maybe<BasicResponse>, TypeParent, TContext>;

    updateSpotifyAuth?: UpdateSpotifyAuthResolver<
      Maybe<BasicResponse>,
      TypeParent,
      TContext
    >;

    _?: _Resolver<Maybe<string>, TypeParent, TContext>;
  }

  export type OnLoginResolver<
    R = Maybe<BasicResponse>,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext, OnLoginArgs>;
  export interface OnLoginArgs {
    user: FirebaseUser;
  }

  export type UpdateSpotifyAuthResolver<
    R = Maybe<BasicResponse>,
    Parent = {},
    TContext = Context
  > = Resolver<R, Parent, TContext, UpdateSpotifyAuthArgs>;
  export interface UpdateSpotifyAuthArgs {
    userId: string;

    creds?: Maybe<SpotifyCredentials>;
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
  BasicResponse?: BasicResponseResolvers.Resolvers<TContext>;
  RecentPlaysResponse?: RecentPlaysResponseResolvers.Resolvers<TContext>;
  Play?: PlayResolvers.Resolvers<TContext>;
  Track?: TrackResolvers.Resolvers<TContext>;
  Artist?: ArtistResolvers.Resolvers<TContext>;
  Image?: ImageResolvers.Resolvers<TContext>;
  SpotifyUrl?: SpotifyUrlResolvers.Resolvers<TContext>;
  Album?: AlbumResolvers.Resolvers<TContext>;
  PlaytimeSummaryResponse?: PlaytimeSummaryResponseResolvers.Resolvers<
    TContext
  >;
  ArtistPlaytime?: ArtistPlaytimeResolvers.Resolvers<TContext>;
  PlaytimeSummaryPeriods?: PlaytimeSummaryPeriodsResolvers.Resolvers<TContext>;
  DashStatsResponse?: DashStatsResponseResolvers.Resolvers<TContext>;
  UserArtistPlaytimes?: UserArtistPlaytimesResolvers.Resolvers<TContext>;
  PeriodGlobalUserArtistPlaytimes?: PeriodGlobalUserArtistPlaytimesResolvers.Resolvers<
    TContext
  >;
  UserGenrePlaytimes?: UserGenrePlaytimesResolvers.Resolvers<TContext>;
  UserGenrePeriodPlaytimes?: UserGenrePeriodPlaytimesResolvers.Resolvers<
    TContext
  >;
  GenrePlaytime?: GenrePlaytimeResolvers.Resolvers<TContext>;
  ArtistStatsResponse?: ArtistStatsResponseResolvers.Resolvers<TContext>;
  ArtistStatsPeriod?: ArtistStatsPeriodResolvers.Resolvers<TContext>;
  ArtistStatsPeriodUser?: ArtistStatsPeriodUserResolvers.Resolvers<TContext>;
  Mutation?: MutationResolvers.Resolvers<TContext>;
} & { [typeName: string]: never };

export type IDirectiveResolvers<Result> = {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
} & { [directiveName: string]: never };
