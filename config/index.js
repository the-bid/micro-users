const serviceConfig = require('./service.config')
const auth0Config = require('./auth0.config')

module.exports = {
  ...serviceConfig,
  ...auth0Config
}
