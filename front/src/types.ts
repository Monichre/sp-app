// Generated in 2019-08-04T21:33:46-07:00
// REGENERATE THIS BY STARTING THE LOCAL BACKEND
// AND THEN RUNNING `front % yarn generate`

export type Maybe<T> = T | null;

// ====================================================
// Documents
// ====================================================

export type GetUserInfoVariables = {
  uid: string;
};

export type GetUserInfoQuery = {
  __typename?: "Query";

  getUserInfo: GetUserInfoGetUserInfo;
};

export type GetUserInfoGetUserInfo = {
  __typename?: "UserInfoResponse";

  uid: string;

  email: string;

  displayName: Maybe<string>;

  lastUpdate: Maybe<string>;

  photoURL: Maybe<string>;

  initialHarvestComplete: Maybe<boolean>;
};

export type RecentPlaysVariables = {
  uid: string;
};

export type RecentPlaysQuery = {
  __typename?: "Query";

  recentPlays: RecentPlaysRecentPlays;
};

export type RecentPlaysRecentPlays = {
  __typename?: "RecentPlaysResponse";

  lastUpdate: Maybe<string>;

  plays: RecentPlaysPlays[];
};

export type RecentPlaysPlays = {
  __typename?: "Play";

  playedAt: string;

  track: RecentPlaysTrack;
};

export type RecentPlaysTrack = {
  __typename?: "Track";

  name: string;

  artists: RecentPlaysArtists[];

  album: RecentPlaysAlbum;
};

export type RecentPlaysArtists = {
  __typename?: "Artist";

  id: string;

  name: string;

  genres: string[];

  images: RecentPlaysImages[];

  external_urls: RecentPlaysExternalUrls;
};

export type RecentPlaysImages = {
  __typename?: "Image";

  url: string;
};

export type RecentPlaysExternalUrls = {
  __typename?: "SpotifyUrl";

  spotify: string;
};

export type RecentPlaysAlbum = {
  __typename?: "Album";

  images: (Maybe<RecentPlays_Images>)[];
};

export type RecentPlays_Images = {
  __typename?: "Image";

  url: string;
};

export type InsightsArtistStatsVariables = {
  uid: string;
  artistId: string;
};

export type InsightsArtistStatsQuery = {
  __typename?: "Query";

  insightsArtistStats: InsightsArtistStatsInsightsArtistStats;
};

export type InsightsArtistStatsInsightsArtistStats = {
  __typename?: "InsightsArtistStatsResponse";

  artist: InsightsArtistStatsArtist;

  today: InsightsArtistStatsToday;

  thisWeek: InsightsArtistStatsThisWeek;

  thisMonth: InsightsArtistStatsThisMonth;

  lifetime: InsightsArtistStatsLifetime;
};

export type InsightsArtistStatsArtist = ArtistFragmentFragment;

export type InsightsArtistStatsToday = TimescopeStatsFragmentFragment;

export type InsightsArtistStatsThisWeek = TimescopeStatsFragmentFragment;

export type InsightsArtistStatsThisMonth = TimescopeStatsFragmentFragment;

export type InsightsArtistStatsLifetime = TimescopeStatsFragmentFragment;

export type InsightsDashVariables = {
  uid: string;
};

export type InsightsDashQuery = {
  __typename?: "Query";

  insightsDash: InsightsDashInsightsDash;
};

export type InsightsDashInsightsDash = {
  __typename?: "InsightsDashResponse";

  today: InsightsDashToday;

  thisWeek: InsightsDashThisWeek;

  thisMonth: InsightsDashThisMonth;

  lifetime: InsightsDashLifetime;
};

export type InsightsDashToday = TimescopeDashFragment;

export type InsightsDashThisWeek = TimescopeDashFragment;

export type InsightsDashThisMonth = TimescopeDashFragment;

export type InsightsDashLifetime = TimescopeDashFragment;

export type InsightsGenreStatsVariables = {
  uid: string;
  genre: string;
};

export type InsightsGenreStatsQuery = {
  __typename?: "Query";

  insightsGenreStats: InsightsGenreStatsInsightsGenreStats;
};

export type InsightsGenreStatsInsightsGenreStats = {
  __typename?: "InsightsGenreStatsResponse";

  genre: string;

  today: InsightsGenreStatsToday;

  thisWeek: InsightsGenreStatsThisWeek;

  thisMonth: InsightsGenreStatsThisMonth;

  lifetime: InsightsGenreStatsLifetime;
};

export type InsightsGenreStatsToday = TimescopeGenreStatsFragmentFragment;

export type InsightsGenreStatsThisWeek = TimescopeGenreStatsFragmentFragment;

export type InsightsGenreStatsThisMonth = TimescopeGenreStatsFragmentFragment;

export type InsightsGenreStatsLifetime = TimescopeGenreStatsFragmentFragment;

export type InsightsStatsVariables = {
  uid: string;
};

export type InsightsStatsQuery = {
  __typename?: "Query";

  insightsStats: InsightsStatsInsightsStats;
};

export type InsightsStatsInsightsStats = {
  __typename?: "InsightsStatsResponse";

  today: InsightsStatsToday;

  thisWeek: InsightsStatsThisWeek;

  thisMonth: InsightsStatsThisMonth;

  lifetime: InsightsStatsLifetime;
};

export type InsightsStatsToday = {
  __typename?: "TimescopeStats";

  personal: InsightsStatsPersonal;

  group: InsightsStatsGroup;
};

export type InsightsStatsPersonal = {
  __typename?: "PerspectiveStats";

  current: InsightsStatsCurrent;

  delta: Maybe<InsightsStatsDelta>;
};

export type InsightsStatsCurrent = {
  __typename?: "Duration";

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStatsDelta = {
  __typename?: "Delta";

  direction: Maybe<string>;

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStatsGroup = {
  __typename?: "PerspectiveStats";

  current: InsightsStats_Current;

  delta: Maybe<InsightsStats_Delta>;
};

export type InsightsStats_Current = {
  __typename?: "Duration";

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStats_Delta = {
  __typename?: "Delta";

  direction: Maybe<string>;

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStatsThisWeek = {
  __typename?: "TimescopeStats";

  personal: InsightsStats_Personal;

  group: InsightsStats_Group;
};

export type InsightsStats_Personal = {
  __typename?: "PerspectiveStats";

  current: InsightsStats__Current;

  delta: Maybe<InsightsStats__Delta>;
};

export type InsightsStats__Current = {
  __typename?: "Duration";

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStats__Delta = {
  __typename?: "Delta";

  direction: Maybe<string>;

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStats_Group = {
  __typename?: "PerspectiveStats";

  current: InsightsStats___Current;

  delta: Maybe<InsightsStats___Delta>;
};

export type InsightsStats___Current = {
  __typename?: "Duration";

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStats___Delta = {
  __typename?: "Delta";

  direction: Maybe<string>;

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStatsThisMonth = {
  __typename?: "TimescopeStats";

  personal: InsightsStats__Personal;

  group: InsightsStats__Group;
};

export type InsightsStats__Personal = {
  __typename?: "PerspectiveStats";

  current: InsightsStats____Current;

  delta: Maybe<InsightsStats____Delta>;
};

export type InsightsStats____Current = {
  __typename?: "Duration";

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStats____Delta = {
  __typename?: "Delta";

  direction: Maybe<string>;

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStats__Group = {
  __typename?: "PerspectiveStats";

  current: InsightsStats_____Current;

  delta: Maybe<InsightsStats_____Delta>;
};

export type InsightsStats_____Current = {
  __typename?: "Duration";

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStats_____Delta = {
  __typename?: "Delta";

  direction: Maybe<string>;

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStatsLifetime = {
  __typename?: "TimescopeStats";

  personal: InsightsStats___Personal;

  group: InsightsStats___Group;
};

export type InsightsStats___Personal = {
  __typename?: "PerspectiveStats";

  current: InsightsStats______Current;

  delta: Maybe<InsightsStats______Delta>;
};

export type InsightsStats______Current = {
  __typename?: "Duration";

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStats______Delta = {
  __typename?: "Delta";

  direction: Maybe<string>;

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStats___Group = {
  __typename?: "PerspectiveStats";

  current: InsightsStats_______Current;

  delta: Maybe<InsightsStats_______Delta>;
};

export type InsightsStats_______Current = {
  __typename?: "Duration";

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsStats_______Delta = {
  __typename?: "Delta";

  direction: Maybe<string>;

  hrs: number;

  mins: Maybe<number>;
};

export type InsightsArtistsVariables = {
  uid: string;
};

export type InsightsArtistsQuery = {
  __typename?: "Query";

  insightsArtists: InsightsArtistsInsightsArtists;
};

export type InsightsArtistsInsightsArtists = {
  __typename?: "InsightsArtistsResponse";

  today: InsightsArtistsToday;

  thisWeek: InsightsArtistsThisWeek;

  thisMonth: InsightsArtistsThisMonth;

  lifetime: InsightsArtistsLifetime;
};

export type InsightsArtistsToday = TimescopeTopArtistsFragmentFragment;

export type InsightsArtistsThisWeek = TimescopeTopArtistsFragmentFragment;

export type InsightsArtistsThisMonth = TimescopeTopArtistsFragmentFragment;

export type InsightsArtistsLifetime = TimescopeTopArtistsFragmentFragment;

export type InsightsGenresVariables = {
  uid: string;
};

export type InsightsGenresQuery = {
  __typename?: "Query";

  insightsGenres: InsightsGenresInsightsGenres;
};

export type InsightsGenresInsightsGenres = {
  __typename?: "InsightsGenresResponse";

  today: InsightsGenresToday;

  thisWeek: InsightsGenresThisWeek;

  thisMonth: InsightsGenresThisMonth;

  lifetime: InsightsGenresLifetime;
};

export type InsightsGenresToday = TimescopeTopGenresFragmentFragment;

export type InsightsGenresThisWeek = TimescopeTopGenresFragmentFragment;

export type InsightsGenresThisMonth = TimescopeTopGenresFragmentFragment;

export type InsightsGenresLifetime = TimescopeTopGenresFragmentFragment;

export type ArtistFragmentFragment = {
  __typename?: "Artist";

  id: string;

  name: string;

  images: ArtistFragmentImages[];

  external_urls: ArtistFragmentExternalUrls;

  topListeners: Maybe<(Maybe<ArtistFragmentTopListeners>)[]>;
};

export type ArtistFragmentImages = {
  __typename?: "Image";

  url: string;
};

export type ArtistFragmentExternalUrls = {
  __typename?: "SpotifyUrl";

  spotify: string;
};

export type ArtistFragmentTopListeners = {
  __typename?: "TopListener";

  total: Maybe<number>;

  user: Maybe<ArtistFragmentUser>;
};

export type ArtistFragmentUser = {
  __typename?: "User";

  photoURL: Maybe<string>;

  email: Maybe<string>;

  uid: Maybe<string>;

  displayName: Maybe<string>;
};

export type TimescopeStatsFragmentFragment = {
  __typename?: "TimescopeStats";

  timeseries: TimescopeStatsFragmentTimeseries;

  personal: TimescopeStatsFragmentPersonal;

  group: TimescopeStatsFragmentGroup;
};

export type TimescopeStatsFragmentTimeseries = {
  __typename?: "Timeseries";

  label: string;

  values: TimescopeStatsFragmentValues[];
};

export type TimescopeStatsFragmentValues = {
  __typename?: "TimeseriesValue";

  period: string;

  personal: number;

  group: number;
};

export type TimescopeStatsFragmentPersonal = PerspectiveStatsFragmentFragment;

export type TimescopeStatsFragmentGroup = PerspectiveStatsFragmentFragment;

export type PerspectiveStatsFragmentFragment = {
  __typename?: "PerspectiveStats";

  current: PerspectiveStatsFragmentCurrent;

  delta: Maybe<PerspectiveStatsFragmentDelta>;
};

export type PerspectiveStatsFragmentCurrent = {
  __typename?: "Duration";

  hrs: number;

  mins: Maybe<number>;
};

export type PerspectiveStatsFragmentDelta = {
  __typename?: "Delta";

  direction: Maybe<string>;

  hrs: number;

  mins: Maybe<number>;
};

export type PerspectiveDashFragment = {
  __typename?: "PerspectiveTops";

  artists: PerspectiveDashArtists[];

  genres: PerspectiveDashGenres[];
};

export type PerspectiveDashArtists = {
  __typename?: "TopArtistStat";

  personal: number;

  group: number;

  artist: PerspectiveDashArtist;
};

export type PerspectiveDashArtist = {
  __typename?: "Artist";

  id: string;

  name: string;

  images: PerspectiveDashImages[];

  topListeners: Maybe<(Maybe<PerspectiveDashTopListeners>)[]>;
};

export type PerspectiveDashImages = {
  __typename?: "Image";

  url: string;
};

export type PerspectiveDashTopListeners = {
  __typename?: "TopListener";

  total: Maybe<number>;

  user: Maybe<PerspectiveDashUser>;
};

export type PerspectiveDashUser = {
  __typename?: "User";

  photoURL: Maybe<string>;

  email: Maybe<string>;

  uid: Maybe<string>;

  displayName: Maybe<string>;
};

export type PerspectiveDashGenres = {
  __typename?: "TopGenreStat";

  personal: number;

  group: number;

  genre: string;
};

export type TimescopeDashFragment = {
  __typename?: "TimescopeTops";

  timeSeries: TimescopeDashTimeSeries;

  personal: TimescopeDashPersonal;

  group: TimescopeDashGroup;
};

export type TimescopeDashTimeSeries = {
  __typename?: "Timeseries";

  label: string;

  values: TimescopeDashValues[];
};

export type TimescopeDashValues = {
  __typename?: "TimeseriesValue";

  period: string;

  personal: number;

  group: number;
};

export type TimescopeDashPersonal = PerspectiveDashFragment;

export type TimescopeDashGroup = PerspectiveDashFragment;

export type TimescopeGenreStatsFragmentFragment = {
  __typename?: "TimescopeStats";

  timeseries: TimescopeGenreStatsFragmentTimeseries;

  personal: TimescopeGenreStatsFragmentPersonal;

  group: TimescopeGenreStatsFragmentGroup;
};

export type TimescopeGenreStatsFragmentTimeseries = {
  __typename?: "Timeseries";

  label: string;

  values: TimescopeGenreStatsFragmentValues[];
};

export type TimescopeGenreStatsFragmentValues = {
  __typename?: "TimeseriesValue";

  period: string;

  personal: number;

  group: number;
};

export type TimescopeGenreStatsFragmentPersonal = PerspectiveGenreStatsFragmentFragment;

export type TimescopeGenreStatsFragmentGroup = PerspectiveGenreStatsFragmentFragment;

export type PerspectiveGenreStatsFragmentFragment = {
  __typename?: "PerspectiveStats";

  current: PerspectiveGenreStatsFragmentCurrent;

  delta: Maybe<PerspectiveGenreStatsFragmentDelta>;
};

export type PerspectiveGenreStatsFragmentCurrent = {
  __typename?: "Duration";

  hrs: number;

  mins: Maybe<number>;
};

export type PerspectiveGenreStatsFragmentDelta = {
  __typename?: "Delta";

  direction: Maybe<string>;

  hrs: number;

  mins: Maybe<number>;
};

export type TimescopeTopArtistsFragmentFragment = {
  __typename?: "TimescopeTopArtists";

  personal: TimescopeTopArtistsFragmentPersonal[];

  group: TimescopeTopArtistsFragmentGroup[];
};

export type TimescopeTopArtistsFragmentPersonal = ArtistsFragmentFragment;

export type TimescopeTopArtistsFragmentGroup = ArtistsFragmentFragment;

export type ArtistsFragmentFragment = {
  __typename?: "TopArtistStat";

  personal: number;

  group: number;

  artist: ArtistsFragmentArtist;
};

export type ArtistsFragmentArtist = {
  __typename?: "Artist";

  id: string;

  name: string;

  images: ArtistsFragmentImages[];

  topListeners: Maybe<(Maybe<ArtistsFragmentTopListeners>)[]>;
};

export type ArtistsFragmentImages = {
  __typename?: "Image";

  url: string;
};

export type ArtistsFragmentTopListeners = {
  __typename?: "TopListener";

  total: Maybe<number>;

  user: Maybe<ArtistsFragmentUser>;
};

export type ArtistsFragmentUser = {
  __typename?: "User";

  photoURL: Maybe<string>;

  email: Maybe<string>;

  uid: Maybe<string>;

  displayName: Maybe<string>;
};

export type TimescopeTopGenresFragmentFragment = {
  __typename?: "TimescopeTopGenres";

  personal: TimescopeTopGenresFragmentPersonal[];

  group: TimescopeTopGenresFragmentGroup[];
};

export type TimescopeTopGenresFragmentPersonal = GenresFragmentFragment;

export type TimescopeTopGenresFragmentGroup = GenresFragmentFragment;

export type GenresFragmentFragment = {
  __typename?: "TopGenreStat";

  personal: number;

  group: number;

  genre: string;
};

import gql from "graphql-tag";
import * as ReactApolloHooks from "react-apollo-hooks";

// ====================================================
// Fragments
// ====================================================

export const ArtistFragmentFragmentDoc = gql`
  fragment ArtistFragment on Artist {
    id
    name
    images {
      url
    }
    external_urls {
      spotify
    }
    topListeners {
      total
      user {
        photoURL
        email
        uid
        displayName
      }
    }
  }
`;

export const PerspectiveStatsFragmentFragmentDoc = gql`
  fragment PerspectiveStatsFragment on PerspectiveStats {
    current {
      hrs
      mins
    }
    delta {
      direction
      hrs
      mins
    }
  }
`;

export const TimescopeStatsFragmentFragmentDoc = gql`
  fragment TimescopeStatsFragment on TimescopeStats {
    timeseries {
      label
      values {
        period
        personal
        group
      }
    }
    personal {
      ...PerspectiveStatsFragment
    }
    group {
      ...PerspectiveStatsFragment
    }
  }

  ${PerspectiveStatsFragmentFragmentDoc}
`;

export const PerspectiveDashFragmentDoc = gql`
  fragment PerspectiveDash on PerspectiveTops {
    artists {
      personal
      group
      artist {
        id
        name
        images {
          url
        }
        topListeners {
          total
          user {
            photoURL
            email
            uid
            displayName
          }
        }
      }
    }
    genres {
      personal
      group
      genre
    }
  }
`;

export const TimescopeDashFragmentDoc = gql`
  fragment TimescopeDash on TimescopeTops {
    timeSeries {
      label
      values {
        period
        personal
        group
      }
    }
    personal {
      ...PerspectiveDash
    }
    group {
      ...PerspectiveDash
    }
  }

  ${PerspectiveDashFragmentDoc}
`;

export const PerspectiveGenreStatsFragmentFragmentDoc = gql`
  fragment PerspectiveGenreStatsFragment on PerspectiveStats {
    current {
      hrs
      mins
    }
    delta {
      direction
      hrs
      mins
    }
  }
`;

export const TimescopeGenreStatsFragmentFragmentDoc = gql`
  fragment TimescopeGenreStatsFragment on TimescopeStats {
    timeseries {
      label
      values {
        period
        personal
        group
      }
    }
    personal {
      ...PerspectiveGenreStatsFragment
    }
    group {
      ...PerspectiveGenreStatsFragment
    }
  }

  ${PerspectiveGenreStatsFragmentFragmentDoc}
`;

export const ArtistsFragmentFragmentDoc = gql`
  fragment ArtistsFragment on TopArtistStat {
    personal
    group
    artist {
      id
      name
      images {
        url
      }
      topListeners {
        total
        user {
          photoURL
          email
          uid
          displayName
        }
      }
    }
  }
`;

export const TimescopeTopArtistsFragmentFragmentDoc = gql`
  fragment TimescopeTopArtistsFragment on TimescopeTopArtists {
    personal {
      ...ArtistsFragment
    }
    group {
      ...ArtistsFragment
    }
  }

  ${ArtistsFragmentFragmentDoc}
`;

export const GenresFragmentFragmentDoc = gql`
  fragment GenresFragment on TopGenreStat {
    personal
    group
    genre
  }
`;

export const TimescopeTopGenresFragmentFragmentDoc = gql`
  fragment TimescopeTopGenresFragment on TimescopeTopGenres {
    personal {
      ...GenresFragment
    }
    group {
      ...GenresFragment
    }
  }

  ${GenresFragmentFragmentDoc}
`;

// ====================================================
// Components
// ====================================================

export const GetUserInfoDocument = gql`
  query GetUserInfo($uid: String!) {
    getUserInfo(uid: $uid) {
      uid
      email
      displayName
      lastUpdate
      photoURL
      initialHarvestComplete
    }
  }
`;
export function useGetUserInfo(
  baseOptions?: ReactApolloHooks.QueryHookOptions<GetUserInfoVariables>
) {
  return ReactApolloHooks.useQuery<GetUserInfoQuery, GetUserInfoVariables>(
    GetUserInfoDocument,
    baseOptions
  );
}
export const RecentPlaysDocument = gql`
  query RecentPlays($uid: String!) {
    recentPlays(uid: $uid) {
      lastUpdate
      plays {
        playedAt
        track {
          name
          artists {
            id
            name
            genres
            images {
              url
            }
            external_urls {
              spotify
            }
          }
          album {
            images {
              url
            }
          }
        }
      }
    }
  }
`;
export function useRecentPlays(
  baseOptions?: ReactApolloHooks.QueryHookOptions<RecentPlaysVariables>
) {
  return ReactApolloHooks.useQuery<RecentPlaysQuery, RecentPlaysVariables>(
    RecentPlaysDocument,
    baseOptions
  );
}
export const InsightsArtistStatsDocument = gql`
  query InsightsArtistStats($uid: String!, $artistId: String!) {
    insightsArtistStats(uid: $uid, gid: "global", artistId: $artistId) {
      artist {
        ...ArtistFragment
      }
      today {
        ...TimescopeStatsFragment
      }
      thisWeek {
        ...TimescopeStatsFragment
      }
      thisMonth {
        ...TimescopeStatsFragment
      }
      lifetime {
        ...TimescopeStatsFragment
      }
    }
  }

  ${ArtistFragmentFragmentDoc}
  ${TimescopeStatsFragmentFragmentDoc}
`;
export function useInsightsArtistStats(
  baseOptions?: ReactApolloHooks.QueryHookOptions<InsightsArtistStatsVariables>
) {
  return ReactApolloHooks.useQuery<
    InsightsArtistStatsQuery,
    InsightsArtistStatsVariables
  >(InsightsArtistStatsDocument, baseOptions);
}
export const InsightsDashDocument = gql`
  query InsightsDash($uid: String!) {
    insightsDash(uid: $uid, gid: "global") {
      today {
        ...TimescopeDash
      }
      thisWeek {
        ...TimescopeDash
      }
      thisMonth {
        ...TimescopeDash
      }
      lifetime {
        ...TimescopeDash
      }
    }
  }

  ${TimescopeDashFragmentDoc}
`;
export function useInsightsDash(
  baseOptions?: ReactApolloHooks.QueryHookOptions<InsightsDashVariables>
) {
  return ReactApolloHooks.useQuery<InsightsDashQuery, InsightsDashVariables>(
    InsightsDashDocument,
    baseOptions
  );
}
export const InsightsGenreStatsDocument = gql`
  query InsightsGenreStats($uid: String!, $genre: String!) {
    insightsGenreStats(uid: $uid, gid: "global", genre: $genre) {
      genre
      today {
        ...TimescopeGenreStatsFragment
      }
      thisWeek {
        ...TimescopeGenreStatsFragment
      }
      thisMonth {
        ...TimescopeGenreStatsFragment
      }
      lifetime {
        ...TimescopeGenreStatsFragment
      }
    }
  }

  ${TimescopeGenreStatsFragmentFragmentDoc}
`;
export function useInsightsGenreStats(
  baseOptions?: ReactApolloHooks.QueryHookOptions<InsightsGenreStatsVariables>
) {
  return ReactApolloHooks.useQuery<
    InsightsGenreStatsQuery,
    InsightsGenreStatsVariables
  >(InsightsGenreStatsDocument, baseOptions);
}
export const InsightsStatsDocument = gql`
  query InsightsStats($uid: String!) {
    insightsStats(uid: $uid, gid: "global") {
      today {
        personal {
          current {
            hrs
            mins
          }
          delta {
            direction
            hrs
            mins
          }
        }
        group {
          current {
            hrs
            mins
          }
          delta {
            direction
            hrs
            mins
          }
        }
      }
      thisWeek {
        personal {
          current {
            hrs
            mins
          }
          delta {
            direction
            hrs
            mins
          }
        }
        group {
          current {
            hrs
            mins
          }
          delta {
            direction
            hrs
            mins
          }
        }
      }
      thisMonth {
        personal {
          current {
            hrs
            mins
          }
          delta {
            direction
            hrs
            mins
          }
        }
        group {
          current {
            hrs
            mins
          }
          delta {
            direction
            hrs
            mins
          }
        }
      }
      lifetime {
        personal {
          current {
            hrs
            mins
          }
          delta {
            direction
            hrs
            mins
          }
        }
        group {
          current {
            hrs
            mins
          }
          delta {
            direction
            hrs
            mins
          }
        }
      }
    }
  }
`;
export function useInsightsStats(
  baseOptions?: ReactApolloHooks.QueryHookOptions<InsightsStatsVariables>
) {
  return ReactApolloHooks.useQuery<InsightsStatsQuery, InsightsStatsVariables>(
    InsightsStatsDocument,
    baseOptions
  );
}
export const InsightsArtistsDocument = gql`
  query InsightsArtists($uid: String!) {
    insightsArtists(uid: $uid, gid: "global") {
      today {
        ...TimescopeTopArtistsFragment
      }
      thisWeek {
        ...TimescopeTopArtistsFragment
      }
      thisMonth {
        ...TimescopeTopArtistsFragment
      }
      lifetime {
        ...TimescopeTopArtistsFragment
      }
    }
  }

  ${TimescopeTopArtistsFragmentFragmentDoc}
`;
export function useInsightsArtists(
  baseOptions?: ReactApolloHooks.QueryHookOptions<InsightsArtistsVariables>
) {
  return ReactApolloHooks.useQuery<
    InsightsArtistsQuery,
    InsightsArtistsVariables
  >(InsightsArtistsDocument, baseOptions);
}
export const InsightsGenresDocument = gql`
  query InsightsGenres($uid: String!) {
    insightsGenres(uid: $uid, gid: "global") {
      today {
        ...TimescopeTopGenresFragment
      }
      thisWeek {
        ...TimescopeTopGenresFragment
      }
      thisMonth {
        ...TimescopeTopGenresFragment
      }
      lifetime {
        ...TimescopeTopGenresFragment
      }
    }
  }

  ${TimescopeTopGenresFragmentFragmentDoc}
`;
export function useInsightsGenres(
  baseOptions?: ReactApolloHooks.QueryHookOptions<InsightsGenresVariables>
) {
  return ReactApolloHooks.useQuery<
    InsightsGenresQuery,
    InsightsGenresVariables
  >(InsightsGenresDocument, baseOptions);
}
