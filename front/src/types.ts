// Generated in 2019-03-27T20:29:33-07:00
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
};

export type RecentPlaysArtists = {
  __typename?: "Artist";

  name: string;
};

import gql from "graphql-tag";
import * as ReactApolloHooks from "react-apollo-hooks";

// ====================================================
// Components
// ====================================================

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
