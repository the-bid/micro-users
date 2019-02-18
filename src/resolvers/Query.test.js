const casual = require('casual')
process.env.JWT_SIGNING_SECRET = 'something'
const { users, user, getJWT } = require('./Query')
const MockUser = require('../../test/mock-data/User')
const { tokenObjectTemplate } = require('../../test/object-templates')

describe('Query', () => {
  const context = {}
  afterAll(() => {
    delete process.env.JWT_SIGNING_SECRET
  })
  describe('users', () => {
    beforeEach(() => {
      const usersData = Array.from(new Array(casual.integer(1, 100)), () => new MockUser())
      context.auth0Mgmt = {
        getUsers: jest.fn(() => usersData)
      }
    })
    afterEach(() => {
      delete context.auth0Mgmt
    })
    test('users calls auth0Mgmt getUsers', async () => {
      expect.assertions(1)
      await users({}, {}, context)
      expect(context.auth0Mgmt.getUsers).toHaveBeenCalledTimes(1)
    })
    test('users calls auth0Mgmt getUsers with a filter', async () => {
      expect.assertions(1)
      const filter = 'name:*att'
      await users({}, { filter }, context)
      expect(context.auth0Mgmt.getUsers).toHaveBeenCalledWith({ search_engine: 'v3', q: filter })
    })
    test('users returns a list of users', async () => {
      expect.hasAssertions()
      const result = await users({}, {}, context)
      expect(result).toEqual(expect.any(Array))
      result.forEach(user => {
        expect(user).toBeInstanceOf(MockUser)
      })
    })
  })
  describe('user', () => {
    beforeEach(() => {
      context.auth0Mgmt = {
        getUser: jest.fn(() => [new MockUser()])
      }
    })
    afterEach(() => {
      delete context.auth0Mgmt
    })
    test('calls auth0Mgmt getUser wiith id', async () => {
      expect.assertions(1)
      const id = casual.uuid
      await user({}, { id }, context)
      expect(context.auth0Mgmt.getUser).toHaveBeenCalledWith(id)
    })
    test('returns a single user', async () => {
      expect.assertions(1)
      const result = await user({}, { id: casual.uuid }, context)
      expect(result).toBeInstanceOf(MockUser)
    })
    test('throws an error if no user is found', async () => {
      expect.assertions(1)
      context.auth0Mgmt.getUser = jest.fn(() => [])
      await expect(user({}, { id: casual.uuid }, context)).rejects.toThrow('Could not find user:')
    })
    test('throws an error if more than one user is returned from auth0Mgmt getUser', async () => {
      expect.assertions(1)
      context.auth0Mgmt.getUser = jest.fn(() => Array.from(new Array(2), () => new MockUser()))
      await expect(user({}, { id: casual.uuid }, context)).rejects.toThrow('Found multiple users with user_id:')
    })
  })
  describe('getJWT', () => {
    beforeEach(() => {
      context.auth0Auth = {
        users: {
          getInfo: jest.fn(() => ({
            sub: casual.uuid
          }))
        }
      }
      context.request = {
        headers: {
          authorization: `Bearer ${casual.uuid}`
        }
      }
    })
    afterEach(() => {
      delete context.auth0Auth
      delete context.request
    })
    test('getJWT calls auth0Auth with bearerToken', async () => {
      const token = context.request.headers.authorization.replace('Bearer ', '')
      await getJWT({}, {}, context)
      expect(context.auth0Auth.users.getInfo).toHaveBeenCalledWith(token)
    })
    test('getJWT returns a Authorization object', async () => {
      const result = await getJWT({}, {}, context)
      expect(result).toMatchObject(tokenObjectTemplate)
    })
    test('getJWT throws an error if object is not returned for auth0Auth getInfo', async () => {
      context.auth0Auth.users.getInfo = jest.fn(() => 'User not found')
      await expect(getJWT({}, {}, context)).rejects.toThrow('User not found')
    })
  })
})
