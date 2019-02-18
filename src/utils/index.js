function parseBearerToken(request) {
  return request.headers.authorization.replace('Bearer ', '')
}

const SERVICE_TO_AUTH0_FIELD_MAPPING = {
  id: 'user_id',
  username: 'nickname',
  createdAt: 'created_at'
}

function updateQueryStringForAuth0FieldNames(queryString) {
  const auth0FieldsRegex = new RegExp(Object.keys(SERVICE_TO_AUTH0_FIELD_MAPPING).join('|'), 'gi')
  return queryString.replace(auth0FieldsRegex, match => SERVICE_TO_AUTH0_FIELD_MAPPING[match])
}

module.exports = { parseBearerToken, updateQueryStringForAuth0FieldNames }
