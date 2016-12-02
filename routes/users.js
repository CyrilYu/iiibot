var router = require('koa-router')()
import jwt from 'jsonwebtoken'
import config from '../config'
import { users as User } from '../models'

const API = {
  UPDATE: '/:id',
  QUERY: '/'
}
const secretkey = config.secretkey

router.patch(API.UPDATE, async function (ctx, next) {
  ctx.checkHeader('authorization').notEmpty()
  ctx.checkBody('pushToken').notEmpty()

  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
    return
  }
  const parts = ctx.request.header.authorization.split(' ')
  const type  = parts[0]
  const token = parts[1]
  if (type !== 'Bearer') {
    ctx.status = 401
    return
  }
  // verify jwt
  try {
    jwt.verify(token, secretkey)
  } catch (err) {
    ctx.status = 401
    ctx.body   = err.message
    return
  }

  try {
    const user = await User.findOne({ where: { auth_token: token } })
    if (!user) {
      ctx.status = 401
      return
    }
    user.push_token = ctx.request.body.pushToken
    await user.save()
    ctx.status = 201
  } catch (err) {
    ctx.status = 500
    ctx.body   = err.message 
  }
})

router.get(API.QUERY, async function (ctx, next) {
  ctx.checkHeader('authorization').notEmpty()
  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
    return
  }
  const token = ctx.request.header.authorization
  const user = await User.findOne({ where: { auth_token: token } })
  ctx.body = user
})

module.exports = router
