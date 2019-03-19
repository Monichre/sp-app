// Generated in 2019-03-18T01:42:38-07:00
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
}

export interface BasicResponse {
  ok?: Maybe<boolean>;
}

export interface Mutation {
  onLogin?: Maybe<BasicResponse>;

  updateSpotifyAuth?: Maybe<BasicResponse>;

  _?: Maybe<string>;
}

// ====================================================
// Arguments
// ====================================================

export interface OnLoginMutationArgs {
  user: FirebaseUser;
}
export interface UpdateSpotifyAuthMutationArgs {
  userId: string;

  creds?: Maybe<SpotifyCredentials>;
}

import { GraphQLResolveInfo } from "graphql";

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
  export interface Resolvers<TContext = {}, TypeParent = {}> {
    dummy?: DummyResolver<Maybe<string>, TypeParent, TContext>;

    _?: _Resolver<Maybe<string>, TypeParent, TContext>;

    ping?: PingResolver<Maybe<BasicResponse>, TypeParent, TContext>;
  }

  export type DummyResolver<
    R = Maybe<string>,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type _Resolver<
    R = Maybe<string>,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type PingResolver<
    R = Maybe<BasicResponse>,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace BasicResponseResolvers {
  export interface Resolvers<TContext = {}, TypeParent = BasicResponse> {
    ok?: OkResolver<Maybe<boolean>, TypeParent, TContext>;
  }

  export type OkResolver<
    R = Maybe<boolean>,
    Parent = BasicResponse,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace MutationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = {}> {
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
    TContext = {}
  > = Resolver<R, Parent, TContext, OnLoginArgs>;
  export interface OnLoginArgs {
    user: FirebaseUser;
  }

  export type UpdateSpotifyAuthResolver<
    R = Maybe<BasicResponse>,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, UpdateSpotifyAuthArgs>;
  export interface UpdateSpotifyAuthArgs {
    userId: string;

    creds?: Maybe<SpotifyCredentials>;
  }

  export type _Resolver<
    R = Maybe<string>,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  {}
>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  {}
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  {}
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string;
}

export type IResolvers<TContext = {}> = {
  Query?: QueryResolvers.Resolvers<TContext>;
  BasicResponse?: BasicResponseResolvers.Resolvers<TContext>;
  Mutation?: MutationResolvers.Resolvers<TContext>;
} & { [typeName: string]: never };

export type IDirectiveResolvers<Result> = {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
} & { [directiveName: string]: never };
