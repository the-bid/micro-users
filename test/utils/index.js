const userObjectTemplate = {
  id: expect.any(String),
  username: expect.any(String),
  createdAt: expect.any(String)
}

const tokenObjectTemplate = {
  token: expect.any(String),
  expiresIn: expect.any(Number)
}

module.exports = { userObjectTemplate, tokenObjectTemplate }
