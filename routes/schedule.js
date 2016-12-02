var router = require('koa-router')()
const moment = require('moment')

const API = {
  LIST: '/list'
}

router.get(API.LIST, async function (ctx, next) {
  ctx.checkHeader('authorization').notEmpty()
  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
    return
  }
  ctx.body = [{
    id: 1,
    schedule: moment().add(1, 'hour').format('HH:00:00')
  },
  {
    id: 2,
    schedule: moment().add(2, 'hour').format('HH:00:00')
  },
  {
    id: 3,
    schedule: moment().add(3, 'hour').format('HH:00:00')
  }]
})

module.exports = router
