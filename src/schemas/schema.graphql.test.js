const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')
const { graphql } = require('graphql')
const { importSchema } = require('graphql-import')
const casual = require('casual')
const { userObjectTemplate, tokenObjectTemplate, missingFieldErrorMessage } = require('../../test/object-templates')

describe('Schema', () => {
  let schema = null
  beforeAll(() => {
    const typeDefs = importSchema(`${__dirname}/schema.graphql`)
    schema = makeExecutableSchema({ typeDefs })
    addMockFunctionsToSchema({
      schema,
      mocks: {
        DateTime: () => casual.moment.toISOString()
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
        const query = `query users{
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
          expect(user).toMatchObject(userObjectTemplate)
        })
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
        expect(data.user).toMatchObject(userObjectTemplate)
      })
      test('returns a GraphQLError for missing id field', async () => {
        expect.assertions(1)
        const query = `query user{
          user{
            id
            username
            createdAt
          }
        }`
        const result = await graphql(schema, query)
        expect(result).toHaveProperty(
          'errors',
          expect.arrayContaining([
            expect.objectContaining(missingFieldErrorMessage({ method: 'user', field: 'id', type: 'ID' }))
          ])
        )
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
        expect(data.getJWT).toMatchObject(tokenObjectTemplate)
      })
    })
  })
})
