# Soundpruf App

Monorepo for services that deliver the Soundpruf app.

I SHOULDNT BE ABLE TO PUSH THIS
SECOND TEST
THIRD TEST

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

## full stack

To deploy the full stack, from the project root:

```
% TARGET=whatever CONFIG=mustexist yarn deploy:all
```

To deploy everything to the test environment, use the shortcut `yarn deploy:all:test`

## backend

`TARGET=whatever CONFIG=mustexist yarn deploy`

Builds and deploys the entire backend to an arbitrary **TARGET** using the settings specified in the ssm parameters at /${sls-service}/config/${TARGET}/public and /private.

It also sets ssm params at /${sls-service}/target/${TARGET}/public:
- API_ENDPOINT to the url of whatever was just deployed
- CONFIG to whatever was used for this deployment
- (will eventually need to set other ssm params at /private)

## frontend

`TARGET=whatever yarn build && TARGET=whatever yarn deploy`

Builds and deploys the frontend to a **TARGET** that should match an already-deployed backend.  Uses settings from:
- API_ENDPOINT and CONFIG from ssm params at /${sls-service}/target/${TARGET}/public
- other eg public client ids from ssm at /${sls-service}/config/${CONFIG}/public

# making changes

Using gitflow.  Two special branches:
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

And then there are three types of general branches:
- `feat/xx` each new unit of work, that should roughly correspond to a card
  - created from and update from `dev`
  - only merged into `dev`
- `release/xx` branched from dev when we have a set of features we want to deploy to prod
  - this is what deploy to staging to test deployment
  - can have direct commits to fix issues, but needs to be merged back to `dev` if you do
- `hotfix/xx` small changes to fix things in a release, have to get merged back to `dev` as well

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

If you want to reference a resource in a lambda, pass it as a env variable to that lambda with a generic name.  e.g. TABLE_TARGET not TableProfile.

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

- [ ] devops: figger out better way to distinguish between 'offline' and 'cloud' modes independent of target

