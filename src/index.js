const { GraphQLServer } = require('graphql-yoga')
const { ApolloEngine } = require('apollo-engine')
const { ManagementClient, AuthenticationClient } = require('auth0')
const { GraphQLDateTime: DateTime } = require('graphql-iso-date')
const Query = require('./resolvers/Query')
const User = require('./resolvers/User')
const {
  PORT,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_DOMAIN,
  AUTH0_SCOPES,
  APOLLO_ENGINE_API_KEY
} = require('../config')

const resolvers = {
  Query,
  User,
  DateTime
}

const auth0Mgmt = new ManagementClient({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  clientSecret: AUTH0_CLIENT_SECRET,
  scope: AUTH0_SCOPES
})

const auth0Auth = new AuthenticationClient({
  domain: AUTH0_DOMAIN
})

const server = new GraphQLServer({
  typeDefs: __dirname + '/schemas/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    auth0Mgmt,
    auth0Auth
  })
})

const engine = new ApolloEngine({
  apiKey: APOLLO_ENGINE_API_KEY,
  stores: [
    {
      name: 'privateResponseMemCache'
    }
  ],
  sessionAuth: {
    header: 'Authorization'
  },
  queryCache: {
    privateFullQueryStore: 'privateResponseMemCache'
  }
})
const graphQLServer = server.createHttpServer({
  tracing: true,
  cacheControl: true
})

/*eslint-disable no-console*/
engine.listen(
  {
    port: PORT,
    httpServer: graphQLServer,
    graphqlPaths: ['/']
  },
  () => console.log(`the-bid-users is running on port: ${PORT}`)
)
/*eslint-enable no-console*/
