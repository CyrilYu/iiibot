var router = require('koa-router')()

import { users as User } from '../models'

const API = {
  SIGNIN: '/sign_in',
  UPDATE: '/:id',
  QUERY: '/'
}

router.patch(API.UPDATE, async function (ctx, next) {
  ctx.checkHeader('authorization').notEmpty()
  ctx.checkBody('pushToken').notEmpty()

  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
    return
  }
  const token = ctx.request.header.authorization
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
