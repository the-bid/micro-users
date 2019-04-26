const jwt = require('jsonwebtoken')
const { parseBearerToken, updateQueryStringForAuth0FieldNames } = require('../utils')
const { JWT_SIGNING_SECRET } = require('../../config')

module.exports = {
  users,
  user,
  getJWT
}

function users(root, { filter }, context, info) {
  const params = {}
  if (filter) {
    params.search_engine = 'v3'
    params.q = updateQueryStringForAuth0FieldNames(filter)
  }
  return context.auth0Mgmt.getUsers(params)
}

async function user(root, { id }, context, info) {
  try {
    const result = await context.auth0Mgmt.getUser({ id })
    return result
  } catch ({ message, statusCode }) {
    let errorMessage
    switch (statusCode) {
      case 404:
        errorMessage = `The user ${id} does not exist.`
        break
      default:
        errorMessage = message
        break
    }
    throw new Error(errorMessage)
  }
}

async function getJWT(root, args, context, info) {
  const result = await context.auth0Auth.users.getInfo(parseBearerToken(context.request))

  if (typeof result !== 'object') {
    throw new Error(result)
  }
  const token = await jwt.sign(result, JWT_SIGNING_SECRET, { expiresIn: '1h' })
  return { token, expiresIn: 3600000 }
}
