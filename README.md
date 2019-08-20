# Soundpruf App

Monorepo for services that deliver the Soundpruf app.

# IMPORTANT:

A critical manual dependency has been introduced: our spotify app configuration.  For brand-new deployments, this will need to be manually configured.  This only has to be done once for every deployment target.  See more under **deploying**.

# services overview

Each service has its own `serverless.yml` for deployment.

## `front/`

The service that delivers the web frontend.
Depends on the deployment of `back/`, and uses ssm parameters generated by its deployment.

## `back/`

The service that currently provides the graphql api endpoints, and a bunch of handlers for the stream harvest.  This will eventually be split into more services as it grows.

## `back-layer/`

A service that just provides an AWS layer that includes all the npm production dependencies for `back/`.

# developer setup

From the root of the project:

```
% yarn install:all
```

This installs the npm packages and then installs some mock aws jars.  If this fails, it is most likely due to some environment difference -- get hands-on help immediately!

# run locally

IMPORTANT: You need the AWS CLI installed locally.  You have to have AWS environment variables set.  This is either an AWS_PROFILE that has the creds you need, or the actual env vars for the creds.

## Start the backend

In `back/`, in three separate terminals (yeah i know), run:

```
% yarn start:first
% yarn start:second
% yarn start:last
```

TODO: can we spawn these all at once in a single script?  use free-port to clean up before starting?

## Start the frontend:

Once the backend is running, open a fourth terminal and go to `front/`, in one more terminal, run:

```
% yarn start
```

# deploying

A **TARGET** is an arbitrarily-named stack that you want to deploy to.

- `local` is a special **TARGET** that should not be used for deployment.  Some bits use this target to behave differently.

A **CONFIG** is a collection of settings.  It should map to a SSM Parameter path.


## CRITICAL MANUAL DEPENDENCY

**NOTE:** we are currently using a test spotify app under stevo's personal account.  We will need to create a spotify service account so we can publish a few apps and manage them together.  The following instructions are where we want to be.

You need to update the authorized domains every time you deploy to a completely new target:
- log in to the spotify developer console with our service account
- select the spotify app that matches the config you are using for the target
- add a domain name that follows the pattern you see, for the new target you're deploying to.

### Thoughts on automating this

We have a spotify app, we use its credentials in the login-with-spotify process and other back-end stuff.  But it needs to be configured to accept auth requests from specific domains.  So when we deploy to a target on an arbitrary AWS domain, it doesn't work.  You have to manually go into the app console and add an auth domain for whatever you just deployed.

You cannot use wildcards.  There is no API that I could find that lets you change that setting.

Only option I can think of: a puppeteer script that actually logs in to the damn console and clicks on things to make the change happen.

## full stack

To deploy the full stack, from the project root:

```
% TARGET=whatever CONFIG=mustexist yarn deploy:all
```

To deploy everything to the test environment, use the shortcut `yarn deploy:all:test`

## back-layer

`TARGET=whatever yarn deploy`

Deploys the `npm` layer and generates the cloudformation outputs that the backend needs to reference that layer.

## back

`TARGET=whatever CONFIG=mustexist yarn deploy`

Builds and deploys the entire backend to an arbitrary **TARGET** using the settings specified in the ssm parameters at /${sls-service}/config/${TARGET}/public and /private.

It also sets ssm params at /${sls-service}/target/${TARGET}/public:
- API_ENDPOINT to the url of whatever was just deployed
- CONFIG to whatever was used for this deployment
- (will eventually need to set other ssm params at /private)

## front

`TARGET=whatever yarn build && TARGET=whatever yarn deploy`

Builds and deploys the frontend to a **TARGET** that should match an already-deployed backend.  Uses settings from:
- API_ENDPOINT and CONFIG from ssm params at /${sls-service}/target/${TARGET}/public
- other eg public client ids from ssm at /${sls-service}/config/${CONFIG}/public

# making changes / developer tips

## branching

Using gitflow.

### master and dev

Two special branches are restricted.  You will not be able to push or merge to them directly.  You need to make a PR.

- `master` has tagged versions that we can deploy
  - merges only from:
    - `hotfix/xx` for critical production fixes
    - `release/xx` for vetted new releases, merges always come with a new version tag
  - rollback: we can always checkout an older version tag and deploy it
- `dev` every completed feature
  - merges only from:
    - `hotfix/xx` if appropriate
    - `feat/xx` for new features
  - will have some sort of CD that will deploy commits to a cloud environment

### feat/xx, release/xx, and hotfix/xx branches

And then there are three types of general branches:
- `feat/xx` each new unit of work, that should roughly correspond to a card
  - created from and update from `dev`
  - only merged into `dev`
- `release/xx` branched from dev when we have a set of features we want to deploy to prod
  - this is what deploy to staging to test deployment
  - can have direct commits to fix issues, but needs to be merged back to `dev` if you do
- `hotfix/xx` small changes to fix things in a release, have to get merged back to `dev` as well

## "works locally, but not in cloud" common issues

If you're adding new types of resources: you might need to update the iamRoles.  The error logs for a function will tell you exactly what perms they're missing.

If you're adding new npm dependencies, you will need to make sure you add them -D in the `back` service and add them normally in the `back-layer` service.  Deploy a new `back-layer` for your deployment when you do this.

Getting a CORS error in the front end?  Chances are that's a spurious error -- if the handler chokes, sometimes you'll see CORS errors.

MAKE SURE YOU `await` all the async behavior in your handlers!  Locally, those will finish even if you don't await, because the serverless offline server is a single process.  In the cloud, those will cause strange hard-to-troubleshoot inconsistencies, as the promise's WONT resolve if the lambda function returns before they do.  AWAIT THOSE ASYNCS YO

# Managing Deployed Stacks

Most everything is handled by the serverless deployment and should not be deleted or created through the aws console.  When deleting temporary stacks, use `TARGET=foo CONFIG=bar sls remove`, don't delete through the console.

## Non-stack Resources

### Configs

The only thing you should be touching through the console is handful of config params in AWS Systems Manager.  Make sure they match the format: (TODO)

## New Resources

Thoroughly test new resources in test deployments!

### Offline Support

Most AWS resources that you add to serverless.yml will require some shenanigans to get them to work offline.

#### Any Resource Referenced in lambda Env

(explain madness with custom.cfref and .ref, need to update local.env)

If you want to reference a resource in a lambda, pass it as a env variable to that lambda with a generic name.  e.g. TABLE_TARGET not TableUser.

#### Kinesis Streams

that stupid `create-streams.sh` script

#### DynamoDB

should be nothing, creates tables on start

#### SQS

need to change config/elasticmq

# release target

## back
- [x] basic http handlers
- [x] sqs offline & online
- [x] ddb offline & online (with streams!)
- [x] kinesis offline & online
- [x] fake fb auth creation via custom resource
- [x] graphql endpoint w ping result
- [x] mutation: onLogin(FirebaseUser)
- [ ] after frontend manually set oauth creds: run harvest on every spotify oauth cred
- [ ] custom spotify oauth for firebase auth
- [ ] capture oauth creds for harvest
- [ ] data dump from target a to target b
- [ ] real create fb auth via customresource NEED TO SORT OUT SUP W GCP ORG
- [ ] graphql endpoint + firebase auth

### firebase auth customresource
- [ ] distinguish between create/update/remove cfn requests
- [ ] return the four public keys needed for frontend (some of this can actually be inferred, only API key is really needed)
- [ ] return whatever creds are needed for backend

## front
- [x] auth with firebase
- [x] correct env for firebase auth
- [x] correct endpoint for app
- [x] apollo client showing ping result
- [x] mutation: onLogin stub
- [x] codegen for ts types
- [ ] manually set spotify oauth creds
- [ ] poll myPlayedLatest resolver
- [ ] suspense for loading indicators

# refactor opps

## back

- [x] clutter in `back/` into something like `back/configs/`
- [ ] any way to put `back/.dynamodb/` stuff into `back/.devdep/`? (I RTFS and it doesnt look like it)
- [x] `back/.env` should be in `back` and not named `.env`, theyre dummy vals part of distro
- [ ] that stupid create kinesis streams script, make it smarter

## front


## Graphql Types

Any modifications to the backend GraphQL resolvers or types must be recompiled on both the front end and backend. 

**This can be accomplished on the backend** by executing `yarn generate`

**On the frontend** this can be accomplished by running `yarn gql-gen`


CLUBHOUSE_TOKEN=5d5b22be-f9c9-42cb-8058-5a777176c7dd
AGL Project ID=10

ASANA_PROJECT_ID=1115096210838428
