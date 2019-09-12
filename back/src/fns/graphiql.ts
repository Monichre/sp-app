import 'reflect-metadata'

const lambdaPlayground = require('graphql-playground-middleware-lambda').default

const endpoint = process.env.STAGE == 'local' ? '/graphql' : `/${process.env.STAGE}/graphql`

export const handler = lambdaPlayground({ endpoint })

