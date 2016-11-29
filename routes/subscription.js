import moment from 'moment'
import _ from 'lodash'
import {
  subscriptions as Subscription
} from '../models'
var router = require('koa-router')()

const API = {
  QUERY: '/query',
  LIST: '/list',
  ADD: '/add',
  UPDATE: '/:id',
  DELETE: '/:id'
}

router.get(API.QUERY, async function (ctx, next) {
  ctx.checkQuery('id').notEmpty()
  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
    return
  }
  const ids = []
  _.each(ctx.request.query.id, id => {
    ids.push(id)
  })
  const result = await Subscription.findAll({ where: { id: { $in: ids } } })
  ctx.body = result
})

router.get(API.LIST, async function (ctx, next) {
  ctx.checkQuery('user_id').notEmpty()
  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body = errors
    return
  }
  const userId = ctx.request.query.user_id
  const list = await Subscription.findAll({ where: { user_id: userId } })
  ctx.body = list
})

router.post(API.ADD, async function (ctx, next) {
  ctx.checkBody('user_id').notEmpty()
  ctx.checkBody('topic').notEmpty('topic should not be empty.')
  ctx.checkBody('keyword').optional()
  ctx.checkBody('schedule').notEmpty('schedule should not be empty.')
  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body = errors
    return
  }
  const spec = ctx.request.body

  const obj = {
    user_id: spec.user_id,
    topic: spec.topic,
    keyword: spec.keyword || '',
    schedule: moment().add(1, 'hour').format('HH:00:00')
  }

  const sub = await Subscription.create(obj)
  ctx.status = 201
  ctx.body   = sub
})

router.delete(API.DELETE, async function (ctx, next) {
  ctx.status = 200
})

module.exports = router
