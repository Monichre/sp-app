// Generated in 2019-04-09T18:26:42-07:00
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

  topArtists: DashStatsTopArtists;

  topGenres: DashStatsTopGenres;
};

export type DashStatsTopArtists = {
  __typename?: "UserArtistPlaytimes";

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

  artist: DashStatsArtist;

  playDurationMs: number;
};

export type DashStatsArtist = {
  __typename?: "Artist";

  name: string;

  images: DashStatsImages[];

  external_urls: DashStatsExternalUrls;
};

export type DashStatsImages = {
  __typename?: "Image";

  url: string;
};

export type DashStatsExternalUrls = {
  __typename?: "SpotifyUrl";

  spotify: string;
};

export type DashStatsUser = {
  __typename?: "ArtistPlaytime";

  artist: DashStats_Artist;

  playDurationMs: number;
};

export type DashStats_Artist = {
  __typename?: "Artist";

  name: string;

  images: DashStats_Images[];

  external_urls: DashStats_ExternalUrls;
};

export type DashStats_Images = {
  __typename?: "Image";

  url: string;
};

export type DashStats_ExternalUrls = {
  __typename?: "SpotifyUrl";

  spotify: string;
};

export type DashStatsMonth = {
  __typename?: "PeriodGlobalUserArtistPlaytimes";

  global: DashStats_Global[];

  user: DashStats_User[];
};

export type DashStats_Global = {
  __typename?: "ArtistPlaytime";

  artist: DashStats__Artist;

  playDurationMs: number;
};

export type DashStats__Artist = {
  __typename?: "Artist";

  name: string;

  images: DashStats__Images[];

  external_urls: DashStats__ExternalUrls;
};

export type DashStats__Images = {
  __typename?: "Image";

  url: string;
};

export type DashStats__ExternalUrls = {
  __typename?: "SpotifyUrl";

  spotify: string;
};

export type DashStats_User = {
  __typename?: "ArtistPlaytime";

  artist: DashStats___Artist;

  playDurationMs: number;
};

export type DashStats___Artist = {
  __typename?: "Artist";

  name: string;

  images: DashStats___Images[];

  external_urls: DashStats___ExternalUrls;
};

export type DashStats___Images = {
  __typename?: "Image";

  url: string;
};

export type DashStats___ExternalUrls = {
  __typename?: "SpotifyUrl";

  spotify: string;
};

export type DashStatsLife = {
  __typename?: "PeriodGlobalUserArtistPlaytimes";

  global: DashStats__Global[];

  user: DashStats__User[];
};

export type DashStats__Global = {
  __typename?: "ArtistPlaytime";

  artist: DashStats____Artist;

  playDurationMs: number;
};

export type DashStats____Artist = {
  __typename?: "Artist";

  name: string;

  images: DashStats____Images[];

  external_urls: DashStats____ExternalUrls;
};

export type DashStats____Images = {
  __typename?: "Image";

  url: string;
};

export type DashStats____ExternalUrls = {
  __typename?: "SpotifyUrl";

  spotify: string;
};

export type DashStats__User = {
  __typename?: "ArtistPlaytime";

  artist: DashStats_____Artist;

  playDurationMs: number;
};

export type DashStats_____Artist = {
  __typename?: "Artist";

  name: string;

  images: DashStats_____Images[];

  external_urls: DashStats_____ExternalUrls;
};

export type DashStats_____Images = {
  __typename?: "Image";

  url: string;
};

export type DashStats_____ExternalUrls = {
  __typename?: "SpotifyUrl";

  spotify: string;
};

export type DashStatsTopGenres = {
  __typename?: "UserGenrePlaytimes";

  week: DashStats_Week;

  month: DashStats_Month;

  life: DashStats_Life;
};

export type DashStats_Week = {
  __typename?: "UserGenrePeriodPlaytimes";

  global: DashStats___Global[];

  user: DashStats___User[];
};

export type DashStats___Global = {
  __typename?: "GenrePlaytime";

  name: string;

  playDurationMs: number;
};

export type DashStats___User = {
  __typename?: "GenrePlaytime";

  name: string;

  playDurationMs: number;
};

export type DashStats_Month = {
  __typename?: "UserGenrePeriodPlaytimes";

  global: DashStats____Global[];

  user: DashStats____User[];
};

export type DashStats____Global = {
  __typename?: "GenrePlaytime";

  name: string;

  playDurationMs: number;
};

export type DashStats____User = {
  __typename?: "GenrePlaytime";

  name: string;

  playDurationMs: number;
};

export type DashStats_Life = {
  __typename?: "UserGenrePeriodPlaytimes";

  global: DashStats_____Global[];

  user: DashStats_____User[];
};

export type DashStats_____Global = {
  __typename?: "GenrePlaytime";

  name: string;

  playDurationMs: number;
};

export type DashStats_____User = {
  __typename?: "GenrePlaytime";

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

  day: PlaytimeSummaryDay;

  week: PlaytimeSummaryWeek;

  month: PlaytimeSummaryMonth;
};

export type PlaytimeSummaryDay = {
  __typename?: "PlaytimeSummaryPeriods";

  current: number;

  prev: number;
};

export type PlaytimeSummaryWeek = {
  __typename?: "PlaytimeSummaryPeriods";

  current: number;

  prev: number;
};

export type PlaytimeSummaryMonth = {
  __typename?: "PlaytimeSummaryPeriods";

  current: number;

  prev: number;
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

import gql from "graphql-tag";
import * as ReactApolloHooks from "react-apollo-hooks";

// ====================================================
// Components
// ====================================================

export const DashStatsDocument = gql`
  query DashStats($uid: String!) {
    dashStats(uid: $uid) {
      topArtists {
        week {
          global {
            artist {
              name
              images {
                url
              }
              external_urls {
                spotify
              }
            }
            playDurationMs
          }
          user {
            artist {
              name
              images {
                url
              }
              external_urls {
                spotify
              }
            }
            playDurationMs
          }
        }
        month {
          global {
            artist {
              name
              images {
                url
              }
              external_urls {
                spotify
              }
            }
            playDurationMs
          }
          user {
            artist {
              name
              images {
                url
              }
              external_urls {
                spotify
              }
            }
            playDurationMs
          }
        }
        life {
          global {
            artist {
              name
              images {
                url
              }
              external_urls {
                spotify
              }
            }
            playDurationMs
          }
          user {
            artist {
              name
              images {
                url
              }
              external_urls {
                spotify
              }
            }
            playDurationMs
          }
        }
      }
      topGenres {
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
      day {
        current
        prev
      }
      week {
        current
        prev
      }
      month {
        current
        prev
      }
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
