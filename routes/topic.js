import moment from 'moment'
var router = require('koa-router')()

const API = {
  LIST: '/list',
  ADD: '/add'
}

router.get(API.LIST, function (ctx, next) {
  ctx.checkHeader('auth_token').notEmpty('auth token should not be empty.')
  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body = errors
    return
  }
  ctx.body = [{
    id: Math.floor(Math.random() * 100) + 1,
    topic: 'Politics'
  },
  {
    id: Math.floor(Math.random() * 100) + 1,
    topic: 'World'
  }]
})

router.post(API.ADD, async function (ctx, next) {
  ctx.status = 201
  ctx.body = {
    id: 'test3',
    topic: 'GDG Talk',
    schedule: moment().format()
  }
})

module.exports = router
