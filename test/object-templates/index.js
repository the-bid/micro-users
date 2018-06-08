const userObjectTemplate = {
  id: expect.any(String),
  username: expect.any(String),
  createdAt: expect.any(String)
}

const tokenObjectTemplate = {
  token: expect.any(String),
  expiresIn: expect.any(Number)
}

function missingFieldErrorMessage({ method, field, type }) {
  return {
    message: `Field "${method}" argument "${field}" of type "${type}!" is required but not provided.`
  }
}

module.exports = { userObjectTemplate, tokenObjectTemplate, missingFieldErrorMessage }
