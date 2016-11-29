var router = require('koa-router')()
const moment = require('moment')

const API = {
  SIGNIN: '/sign_in',
  UPDATE: '/:id',
  QUERY: '/'
}

router.post(API.SIGNIN, function (ctx, next) {

  ctx.checkBody('username').notEmpty('username should not be empty')
  ctx.checkBody('email').notEmpty('email should not be empty').isEmail()
  ctx.checkBody('provider').notEmpty('provider should not be empty')
  ctx.checkBody('thirdPartyId').notEmpty('thirdPartyId should not be empty').isInt()
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

  const auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  const user_id = Math.floor(Math.random() * 100) + 1
  const username = ctx.request.body.username
  ctx.body = {
    auth_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    user_id: Math.floor(Math.random() * 100) + 1,
    user_name: username,
    expiry_date: moment().add(1, 'day').format()
  }
})

router.patch(API.UPDATE, function (ctx, next) {
  ctx.checkHeader('Authorization').notEmpty()
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

router.get(API.QUERY, function (ctx, next) {
  ctx.body = {
    id: Math.floor(Math.random() * 100) + 1,
    email: 'cyrilyu.tw@gmail.com',
    username: 'Cyril Yu'
  }
})

module.exports = router
