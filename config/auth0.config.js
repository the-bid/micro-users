const configuration ={
  AUTH0_SCOPES: 'read:users update:users read:users_app_metadata update:users_app_metadata',
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  AUTH0_MANAGEMENT_URL: process.env.AUTH0_MANAGEMENT_URL
}
module.exports = configuration
