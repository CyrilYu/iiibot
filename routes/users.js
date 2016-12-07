const router = require('koa-router')()
import { authenticate } from './utils'
import { users as User } from '../models'

const API = {
  UPDATE: '/:id',
  QUERY: '/'
}

router.patch(API.UPDATE, async function (ctx) {
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
  const credential = authenticate(type, token)
  if (!credential.isValid) {
    ctx.status = credential.errCode
    ctx.body   = credential.message
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

router.get(API.QUERY, async function (ctx) {
  ctx.checkHeader('authorization').notEmpty()
  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
    return
  }
  const parts = ctx.request.header.authorization.split(' ')
  const type  = parts[0]
  const token = parts[1]
  const credential = authenticate(type, token)
  if (!credential.isValid) {
    ctx.status = credential.errCode
    ctx.body   = credential.message
    return
  }
  const user = await User.findOne({ where: { auth_token: token } })
  ctx.body = user
})

module.exports = router
