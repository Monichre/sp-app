// Generated in 2019-04-02T22:54:05-07:00
// REGENERATE THIS BY STARTING THE LOCAL BACKEND
// AND THEN RUNNING `front % yarn generate`

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
// Documents
// ====================================================

export type DashStatsVariables = {
  uid: string;
};

export type DashStatsQuery = {
  __typename?: "Query";

  dashStats: DashStatsDashStats;
};

export type DashStatsDashStats = {
  __typename?: "DashStatsResponse";

  week: DashStatsWeek;

  month: DashStatsMonth;

  life: DashStatsLife;
};

export type DashStatsWeek = {
  __typename?: "PeriodGlobalUserArtistPlaytimes";

  global: DashStatsGlobal[];

  user: DashStatsUser[];
};

export type DashStatsGlobal = {
  __typename?: "ArtistPlaytime";

  name: string;

  playDurationMs: number;
};

export type DashStatsUser = {
  __typename?: "ArtistPlaytime";

  name: string;

  playDurationMs: number;
};

export type DashStatsMonth = {
  __typename?: "PeriodGlobalUserArtistPlaytimes";

  global: DashStats_Global[];

  user: DashStats_User[];
};

export type DashStats_Global = {
  __typename?: "ArtistPlaytime";

  name: string;

  playDurationMs: number;
};

export type DashStats_User = {
  __typename?: "ArtistPlaytime";

  name: string;

  playDurationMs: number;
};

export type DashStatsLife = {
  __typename?: "PeriodGlobalUserArtistPlaytimes";

  global: DashStats__Global[];

  user: DashStats__User[];
};

export type DashStats__Global = {
  __typename?: "ArtistPlaytime";

  name: string;

  playDurationMs: number;
};

export type DashStats__User = {
  __typename?: "ArtistPlaytime";

  name: string;

  playDurationMs: number;
};

export type PlaytimeSummaryVariables = {
  uid: string;
};

export type PlaytimeSummaryQuery = {
  __typename?: "Query";

  playtimeSummary: PlaytimeSummaryPlaytimeSummary;
};

export type PlaytimeSummaryPlaytimeSummary = {
  __typename?: "PlaytimeSummaryResponse";

  today: number;

  thisMonth: number;
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

  name: string;
};

export type RecentPlaysAlbum = {
  __typename?: "Album";

  images: (Maybe<RecentPlaysImages>)[];
};

export type RecentPlaysImages = {
  __typename?: "Image";

  url: string;
};

import gql from "graphql-tag";
import * as ReactApolloHooks from "react-apollo-hooks";

// ====================================================
// Components
// ====================================================

export const DashStatsDocument = gql`
  query DashStats($uid: String!) {
    dashStats(uid: $uid) {
      week {
        global {
          name
          playDurationMs
        }
        user {
          name
          playDurationMs
        }
      }
      month {
        global {
          name
          playDurationMs
        }
        user {
          name
          playDurationMs
        }
      }
      life {
        global {
          name
          playDurationMs
        }
        user {
          name
          playDurationMs
        }
      }
    }
  }
`;
export function useDashStats(
  baseOptions?: ReactApolloHooks.QueryHookOptions<DashStatsVariables>
) {
  return ReactApolloHooks.useQuery<DashStatsQuery, DashStatsVariables>(
    DashStatsDocument,
    baseOptions
  );
}
export const PlaytimeSummaryDocument = gql`
  query PlaytimeSummary($uid: String!) {
    playtimeSummary(uid: $uid) {
      today
      thisMonth
    }
  }
`;
export function usePlaytimeSummary(
  baseOptions?: ReactApolloHooks.QueryHookOptions<PlaytimeSummaryVariables>
) {
  return ReactApolloHooks.useQuery<
    PlaytimeSummaryQuery,
    PlaytimeSummaryVariables
  >(PlaytimeSummaryDocument, baseOptions);
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
            name
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
