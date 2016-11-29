import moment from 'moment'
var router = require('koa-router')()

const API = {
  LIST: '/list',
  ADD: '/add',
  UPDATE: '/:id',
  DELETE: '/:id'
}

router.get(API.LIST, async function (ctx, next) {
  ctx.checkHeader('token').notEmpty('auth token should not be empty.')
  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body = errors
    return
  }
  ctx.body = [{
    id: 'test1',
    topic: 'Politics',
    schedule: moment().format()
  },
  {
    id: 'test2',
    topic: 'World',
    schedule: moment().format()
  }]
})

router.post(API.ADD, async function (ctx, next) {
  ctx.checkHeader('token').notEmpty('auth token should not be empty.')
  ctx.checkBody('topic').notEmpty('topic should not be empty.')
  ctx.checkBody('schedule').notEmpty('schedule should not be empty.')
  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body = errors
    return
  }
  console.log(ctx.request.body.schedule)
  // console.log(moment(ctx.request.body.schedule, 'HH:mm:ssZ').isValid())
  // if (!moment(ctx.request.body.schedule, 'HH:mm:ssZ').isValid()) {
  //   ctx.status = 400
  //   ctx.body = 'Invalid schedule time format'
  //   return
  // }

  const spec = ctx.request.body
  const topic    = spec.topic
  const schedule = spec.schedule

  ctx.status = 201
  ctx.body = {
    id: 'test3',
    topic: topic,
    schedule: schedule
  }
})

router.patch(API.UPDATE, async function (ctx, next) {
  ctx.status = 202
})

router.delete(API.DELETE, async function (ctx, next) {
  ctx.status = 200
})

module.exports = router
