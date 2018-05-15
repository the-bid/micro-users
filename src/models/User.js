class User {
  constructor(auth0User) {
    this.id = auth0User.user_id
    this.username = auth0User.nickname
    this.createdAt = auth0User.created_at
  }
}

module.exports = User
