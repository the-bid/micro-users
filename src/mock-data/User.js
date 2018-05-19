const { uuid, username, date } = require('casual')

class MockUser {
  constructor() {
    this.user_id = uuid
    this.nickname = username
    this.created_at = date('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
  }
}

module.exports = MockUser
