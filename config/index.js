const serviceConfig = require('./service.config')
const auth0Config = require('./auth0.config')
const apolloConfig = require('./apollo.config')

module.exports = {
  ...serviceConfig,
  ...auth0Config,
  ...apolloConfig
}
