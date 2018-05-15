const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { parseBearerToken } = require('../utils')
const { JWT_SIGNING_SECRET } = require('../../config')

module.exports = {
  users,
  user,
  getJWT
}

async function users(root, args, context, info) {
  const result = await context.auth0Mgmt.getUsers()
  return result.map(user => {
    return new User(user)
  })
}

async function user(root, { id }, context, info) {
  const result = await context.auth0Mgmt.getUser(id)
  if (result.length > 1) {
    throw new Error(`Found multiple users with user_id: ${id}`)
  }
  return new User(result[0])
}

async function getJWT(root, args, context, info) {
  const result = await context.auth0Auth.users.getInfo(parseBearerToken(context.request))
  if (typeof result !== 'object') {
    throw new Error(result)
  }
  const token = await jwt.sign(result, JWT_SIGNING_SECRET, { expiresIn: '1h' })
  return { token, expiresIn: 3600000 }
}
