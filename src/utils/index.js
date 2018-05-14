function parseBearerToken(request){
  return request.headers.authorization.replace('Bearer ','')
}

module.exports = {parseBearerToken}
