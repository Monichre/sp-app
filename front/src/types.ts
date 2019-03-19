// Generated in 2019-03-17T22:54:32-07:00
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

export type OnLoginVariables = {
  user: FirebaseUser;
};

export type OnLoginMutation = {
  __typename?: "Mutation";

  onLogin: Maybe<OnLoginOnLogin>;
};

export type OnLoginOnLogin = {
  __typename?: "BasicResponse";

  ok: Maybe<boolean>;
};

export type PingVariables = {};

export type PingQuery = {
  __typename?: "Query";

  ping: Maybe<PingPing>;
};

export type PingPing = {
  __typename?: "BasicResponse";

  ok: Maybe<boolean>;
};

export type UpdateSpotifyAuthVariables = {
  userId: string;
  creds: SpotifyCredentials;
};

export type UpdateSpotifyAuthMutation = {
  __typename?: "Mutation";

  updateSpotifyAuth: Maybe<UpdateSpotifyAuthUpdateSpotifyAuth>;
};

export type UpdateSpotifyAuthUpdateSpotifyAuth = {
  __typename?: "BasicResponse";

  ok: Maybe<boolean>;
};

import gql from "graphql-tag";
import * as ReactApolloHooks from "react-apollo-hooks";

// ====================================================
// Components
// ====================================================

export const OnLoginDocument = gql`
  mutation OnLogin($user: FirebaseUser!) {
    onLogin(user: $user) {
      ok
    }
  }
`;
export function useOnLogin(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    OnLoginMutation,
    OnLoginVariables
  >
) {
  return ReactApolloHooks.useMutation<OnLoginMutation, OnLoginVariables>(
    OnLoginDocument,
    baseOptions
  );
}
export const PingDocument = gql`
  query Ping {
    ping {
      ok
    }
  }
`;
export function usePing(
  baseOptions?: ReactApolloHooks.QueryHookOptions<PingVariables>
) {
  return ReactApolloHooks.useQuery<PingQuery, PingVariables>(
    PingDocument,
    baseOptions
  );
}
export const UpdateSpotifyAuthDocument = gql`
  mutation UpdateSpotifyAuth($userId: String!, $creds: SpotifyCredentials!) {
    updateSpotifyAuth(userId: $userId, creds: $creds) {
      ok
    }
  }
`;
export function useUpdateSpotifyAuth(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    UpdateSpotifyAuthMutation,
    UpdateSpotifyAuthVariables
  >
) {
  return ReactApolloHooks.useMutation<
    UpdateSpotifyAuthMutation,
    UpdateSpotifyAuthVariables
  >(UpdateSpotifyAuthDocument, baseOptions);
}
