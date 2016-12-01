const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const config = require('../config')

import { users as User } from '../models'

const API = {
  SIGN_IN: '/sign_in'
}

router.get('/', async function (ctx, next) {
  ctx.state = {
    title: 'IIIBOT'
  }

  await ctx.render('index', {
  })
})

router.post(API.SIGNIN, async function (ctx, next) {

  ctx.checkBody('username').notEmpty('username should not be empty')
  ctx.checkBody('email').notEmpty('email should not be empty').isEmail()
  ctx.checkBody('provider').notEmpty('provider should not be empty')
  ctx.checkBody('thirdPartyId').notEmpty('thirdPartyId should not be empty')
  ctx.checkBody('thirdPartyToken').notEmpty('thirdPartyToken should not be empty')
  ctx.checkBody('pushToken').optional()
  ctx.checkBody('platform').notEmpty('platform should not be empty')
  ctx.checkBody('serialNum').notEmpty('serialNum should not be empty')

  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
    return
  }

  const spec = ctx.request.body
  const secretkey = config.secretkey

  const authToken = jwt.sign({
    email: spec.email,
    serial: spec.serialNum
  }, secretkey, { expiresIn: '30d' })

  let user = await User.findOne({
    where: {
      email: spec.email,
      third_party_id: spec.thirdPartyId,
      provider: spec.provider,
      platform: spec.platform
    }
  })

  if (user) {
    user.auth_token = authToken
    user = await user.save()
    ctx.body = user
  } else {
    user = await User.create({
      name: spec.username,
      email: spec.email,
      provider: spec.provider,
      auth_token: authToken,
      platform: spec.platform,
      serial_num: spec.serialNum
    })
    ctx.body = user
  }
})

module.exports = router
