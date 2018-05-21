const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')
const { graphql } = require('graphql')
const { importSchema } = require('graphql-import')
const { moment } = require('casual')

describe('Schema', () => {
  let schema = null
  beforeAll(() => {
    const typeDefs = importSchema(`${__dirname}/schema.graphql`)
    schema = makeExecutableSchema({ typeDefs })
    addMockFunctionsToSchema({
      schema,
      mocks: {
        DateTime: () => moment.toISOString()
      }
    })
  })
  afterAll(() => {
    schema = null
  })
  describe('Query', () => {
    describe('users', () => {
      test('returns a list of users', async () => {
        expect.hasAssertions()
        const query = ` query users{
          users{
            id
            username
            createdAt
          }
        }
        `
        const { data } = await graphql(schema, query)
        expect(data.users).toEqual(expect.any(Array))
        data.users.forEach(user => {
          expect(user).toMatchObject({
            id: expect.any(String),
            username: expect.any(String),
            createdAt: expect.any(String)
          })
        })
      })
      test('returns a GraphQLError for unknown query property', async () => {
        expect.assertions(2)
        const query = `query users{
          users{
            unknown
          }
        }`
        const result = await graphql(schema, query)
        expect(result).toHaveProperty('errors')
        expect(result.errors[0]).toHaveProperty('message', 'Cannot query field "unknown" on type "User".')
      })
    })
    describe('user', () => {
      test('returns one user', async () => {
        expect.assertions(1)
        const query = `query user{
          user(id: "th1s-1s-4-1d"){
            id
            username
            createdAt
          }
        }`
        const { data } = await graphql(schema, query)
        expect(data.user).toMatchObject({
          id: expect.any(String),
          username: expect.any(String),
          createdAt: expect.any(String)
        })
      })
    })
    describe('getJWT', () => {
      test('returns a token and expiresIn', async () => {
        expect.assertions(1)
        const query = `query getJWT{
          getJWT{
            token
            expiresIn
          }
        }`
        const { data } = await graphql(schema, query)
        expect(data.getJWT).toMatchObject({
          token: expect.any(String),
          expiresIn: expect.any(Number)
        })
      })
    })
    test('returns a GraphQLError for unknown query', async () => {
      expect.assertions(2)
      const query = `query unknown{
        unknown{
          id
        }
      }`
      const result = await graphql(schema, query)
      expect(result).toHaveProperty('errors')
      expect(result.errors[0]).toHaveProperty('message', 'Cannot query field "unknown" on type "Query".')
    })
  })
})
