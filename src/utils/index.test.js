const casual = require('casual')
const { parseBearerToken, updateQueryStringForAuth0FieldNames } = require('./index')

describe('utils', () => {
  describe('parseBearerToken', () => {
    const request = {}
    beforeEach(() => {
      request.headers = {
        authorization: `Bearer ${casual.uuid}`
      }
    })
    afterEach(() => {
      delete request.headers
    })
    test('returns token after the word Bearer in the authorization header', () => {
      const result = parseBearerToken(request)
      expect(result).toEqual(expect.stringMatching(/^(?!Bearer).*$/))
    })
    test('returns authorization header if not a Bearer token', () => {
      request.headers.authorization = `Basic ${casual.uuid}`
      const result = parseBearerToken(request)
      expect(result).toEqual(expect.stringMatching(/^Basic\s.*$/))
    })
  })
  describe('updateQueryStringForAuth0FieldNames', () => {
    const testCases = [
      { description: 'updates id to user_id', input: 'id=1234', result: 'user_id=1234' },
      { description: 'updates username to nickname', input: 'username=1234', result: 'nickname=1234' },
      { description: 'updates createdAt to created_at', input: 'createdAt=1234', result: 'created_at=1234' },
      {
        description: 'updates multiple values',
        input: 'username=1234 AND createdAt=1234',
        result: 'nickname=1234 AND created_at=1234'
      },
      { description: 'updates with wildcards', input: 'username=*1234*', result: 'nickname=*1234*' },
      { description: 'no updates', input: 'name=john', result: 'name=john' }
    ]
    testCases.forEach(({ description, input, result }) => {
      test(description, () => {
        expect(updateQueryStringForAuth0FieldNames(input)).toEqual(result)
      })
    })
  })
})
