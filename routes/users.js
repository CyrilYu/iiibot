var router = require('koa-router')()
const moment = require('moment')
import { users as User } from '../models'

const API = {
  SIGNIN: '/sign_in',
  UPDATE: '/:id',
  QUERY: '/'
}

router.post(API.SIGNIN, async function (ctx, next) {

  ctx.checkBody('username').notEmpty('username should not be empty')
  ctx.checkBody('email').notEmpty('email should not be empty').isEmail()
  ctx.checkBody('provider').notEmpty('provider should not be empty')
  ctx.checkBody('thirdPartyId').notEmpty('thirdPartyId should not be empty').isInt()
  ctx.checkBody('thirdPartyToken').notEmpty('thirdPartyToken should not be empty')
  ctx.checkBody('pushToken').optional()
  ctx.checkBody('image').optional()
  ctx.checkBody('platform').notEmpty('platform should not be empty')
  ctx.checkBody('serialNum').notEmpty('serialNum should not be empty')

  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
    return
  }

  const spec = ctx.request.body

  const obj = {
    name: spec.username,
    email: spec.email,
    provider: spec.provider,
    auth_token: spec.thirdPartyToken,
    platform: spec.platform,
    serial_num: spec.serialNum
  }

  const user = await User.create(obj)
  ctx.body = user
})

router.patch(API.UPDATE, function (ctx, next) {
  ctx.checkHeader('authorization').notEmpty()
  ctx.checkParams('id').notEmpty()
  ctx.checkBody('username').optional()
  ctx.checkBody('pushToken').optional()
  ctx.checkBody('image').optional()

  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
    return
  }
  ctx.status = 201
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
