const jwt = require('jsonwebtoken')
const { parseBearerToken } = require('../utils')
const { JWT_SIGNING_SECRET } = require('../../config')

module.exports = {
  users,
  user,
  getJWT
}

function users(root, args, context, info) {
  return context.auth0Mgmt.getUsers()
}

async function user(root, { id }, context, info) {
  const result = await context.auth0Mgmt.getUser(id)
  if (result.length > 1) {
    throw new Error(`Found multiple users with user_id: ${id}`)
  }
  return result[0]
}

async function getJWT(root, args, context, info) {
  const result = await context.auth0Auth.users.getInfo(parseBearerToken(context.request))

  if (typeof result !== 'object') {
    throw new Error(result)
  }
  const token = await jwt.sign(result, JWT_SIGNING_SECRET, { expiresIn: '1h' })
  return { token, expiresIn: 3600000 }
}
