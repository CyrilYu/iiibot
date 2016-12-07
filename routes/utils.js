import jwt from 'jsonwebtoken'
import config from '../config'

const secretkey = config.secretkey

const authenticate = function (type, token) {
  if (type !== 'Bearer') {
    return { isValid: false, message: 'Invalid token type', errCode: 401 }
  }
  // verify jwt
  try {
    jwt.verify(token, secretkey)
    return { isValid: true }
  } catch (err) {
    return { isValid: false, message: err.message, errCode: 401 }
  }
}

module.exports = {
  authenticate: authenticate
}