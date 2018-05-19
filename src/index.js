const { GraphQLServer } = require('graphql-yoga')
const { ManagementClient, AuthenticationClient } = require('auth0')
const Query = require('./resolvers/Query')
const User = require('./resolvers/User')
const { PORT, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_DOMAIN, AUTH0_SCOPES } = require('../config')

const resolvers = {
  Query,
  User
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

/*eslint-disable no-console*/
server.start(
  {
    port: PORT
  },
  () => console.log(`the-bid-users is running on port: ${PORT}`)
)
/*eslint-enable no-console*/
