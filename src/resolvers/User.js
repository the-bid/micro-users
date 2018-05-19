module.exports = {
  id,
  username,
  createdAt
}

function id(root) {
  return root.user_id
}

function username(root) {
  return root.nickname
}

function createdAt(root) {
  return root.created_at
}
