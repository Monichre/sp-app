// Generated in 2019-04-14T12:11:36-07:00
// REGENERATE THIS BY STARTING THE LOCAL BACKEND
// AND THEN RUNNING `front % yarn generate`

export type Maybe<T> = T | null;

// ====================================================
// Documents
// ====================================================

export type ArtistStatsVariables = {
  uid: string;
  id: string;
};

export type ArtistStatsQuery = {
  __typename?: "Query";

  artistStats: ArtistStatsArtistStats;
};

export type ArtistStatsArtistStats = {
  __typename?: "ArtistStatsResponse";

  artist: ArtistStatsArtist;

  past30d: ArtistStatsPast30d;

  past12w: ArtistStatsPast12w;
};

export type ArtistStatsArtist = {
  __typename?: "Artist";

  id: string;

  name: string;

  images: ArtistStatsImages[];

  external_urls: ArtistStatsExternalUrls;

  genres: string[];
};

export type ArtistStatsImages = {
  __typename?: "Image";

  url: string;
};

export type ArtistStatsExternalUrls = {
  __typename?: "SpotifyUrl";

  spotify: string;
};

export type ArtistStatsPast30d = {
  __typename?: "ArtistStatsPeriod";

  global: ArtistStatsGlobal[];

  personal: ArtistStatsPersonal[];
};

export type ArtistStatsGlobal = {
  __typename?: "ArtistStatsPeriodUser";

  period: string;

  playDurationMs: number;
};

export type ArtistStatsPersonal = {
  __typename?: "ArtistStatsPeriodUser";

  period: string;

  playDurationMs: number;
};

export type ArtistStatsPast12w = {
  __typename?: "ArtistStatsPeriod";

  global: ArtistStats_Global[];

  personal: ArtistStats_Personal[];
};

export type ArtistStats_Global = {
  __typename?: "ArtistStatsPeriodUser";

  period: string;

  playDurationMs: number;
};

export type ArtistStats_Personal = {
  __typename?: "ArtistStatsPeriodUser";

  period: string;

  playDurationMs: number;
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

  id: string;

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

  id: string;

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

  id: string;

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

  id: string;

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

  id: string;

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

  id: string;

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

  topLifetimeArtists: PlaytimeSummaryTopLifetimeArtists[];

  day: PlaytimeSummaryDay;

  week: PlaytimeSummaryWeek;

  month: PlaytimeSummaryMonth;
};

export type PlaytimeSummaryTopLifetimeArtists = {
  __typename?: "ArtistPlaytime";

  artist: PlaytimeSummaryArtist;

  playDurationMs: number;
};

export type PlaytimeSummaryArtist = {
  __typename?: "Artist";

  id: string;

  name: string;

  images: PlaytimeSummaryImages[];

  external_urls: PlaytimeSummaryExternalUrls;
};

export type PlaytimeSummaryImages = {
  __typename?: "Image";

  url: string;
};

export type PlaytimeSummaryExternalUrls = {
  __typename?: "SpotifyUrl";

  spotify: string;
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

import gql from "graphql-tag";
import * as ReactApolloHooks from "react-apollo-hooks";

// ====================================================
// Components
// ====================================================

export const ArtistStatsDocument = gql`
  query ArtistStats($uid: String!, $id: String!) {
    artistStats(uid: $uid, id: $id) {
      artist {
        id
        name
        images {
          url
        }
        external_urls {
          spotify
        }
        genres
      }
      past30d {
        global {
          period
          playDurationMs
        }
        personal {
          period
          playDurationMs
        }
      }
      past12w {
        global {
          period
          playDurationMs
        }
        personal {
          period
          playDurationMs
        }
      }
    }
  }
`;
export function useArtistStats(
  baseOptions?: ReactApolloHooks.QueryHookOptions<ArtistStatsVariables>
) {
  return ReactApolloHooks.useQuery<ArtistStatsQuery, ArtistStatsVariables>(
    ArtistStatsDocument,
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
export const DashStatsDocument = gql`
  query DashStats($uid: String!) {
    dashStats(uid: $uid) {
      topArtists {
        week {
          global {
            artist {
              id
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
              id
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
              id
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
              id
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
              id
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
              id
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
      topLifetimeArtists {
        artist {
          id
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
