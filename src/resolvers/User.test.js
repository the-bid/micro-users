const { id, username, createdAt } = require('./User')
const MockUser = require('../../test/mock-data/User')

describe('User', () => {
  let User = null
  beforeEach(() => {
    User = new MockUser()
  })
  afterEach(() => {
    User = null
  })
  describe('id', () => {
    test('id takes a user_id and returns a string', () => {
      const result = id(User)
      expect(result).toEqual(expect.any(String))
    })
  })
  describe('username', () => {
    test('username takes a nickname and returns a string', () => {
      const result = username(User)
      expect(result).toEqual(expect.any(String))
    })
  })
  describe('createdAt', () => {
    test('createdAt takes a created_at and returns a string', () => {
      const result = createdAt(User)
      expect(result).toEqual(expect.any(String))
    })
  })
})
