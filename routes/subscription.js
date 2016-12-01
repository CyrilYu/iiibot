import moment from 'moment'
import Promise from 'bluebird'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import {
  users as User,
  subscriptions as Subscription,
  news as News
} from '../models'
var router = require('koa-router')()

const API = {
  QUERY: '/query',
  LIST: '/list',
  ADD: '/add',
  UPDATE: '/:id',
  DELETE: '/:id'
}

const secretkey = 'iiibot@Diuit'

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
  const data = await Subscription.findAll({ where: { id: { $in: ids } } })

  return Promise.map(data, record => {
    const topic_id = record.topic
    const keyword  = record.keyword || ''
    return News.findAll({ where: { topic_id: topic_id, title: { $like: `%${keyword}%` } } })
  }).then(res => {
    ctx.body = res
  })
})

router.get(API.LIST, async function (ctx, next) {
  // ctx.checkHeader('x-crawler-header').notEmpty().eq('application/crawler.v1')
  ctx.checkHeader('authorization').notEmpty()
  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body = errors
    return
  }

  const header = ctx.request.header
  const token  = header.authorization
  // verify jwt
  try {
    jwt.verify(token, secretkey)
  } catch (err) {
    ctx.status = 401
    ctx.body   = err.message
    return
  }

  const user = await User.findOne({ where: { auth_token: token } })
  console.log(user)
  if (!user) {
    ctx.status = 401
    return
  }
  const list = await Subscription.findAll({ where: { user_id: user.id } })
  ctx.body = list
})

router.post(API.ADD, async function (ctx, next) {
  ctx.checkHeader('authorization').notEmpty()
  ctx.checkBody('topic').notEmpty('topic should not be empty.')
  ctx.checkBody('keyword').optional()
  ctx.checkBody('daily_schedule').notEmpty('schedule should not be empty.')
  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body = errors
    return
  }
  const token  = ctx.request.header.authorization
  // verify jwt
  // try {
  //   jwt.verify(token, secretkey)
  // } catch (err) {
  //   ctx.status = 401
  //   ctx.body   = err.message
  //   return
  // }

  const spec = ctx.request.body
  const user = await User.findOne({ where: { auth_token: token } })
  if (!user) {
    ctx.status = 401
    return
  }
  const obj = {
    user_id: user.id,
    topic: spec.topic,
    keyword: spec.keyword || '',
    schedule: moment().add(1, 'hour').format('HH:00:00')
  }

  const sub = await Subscription.create(obj)
  ctx.status = 201
  ctx.body   = sub
})

router.delete(API.DELETE, async function (ctx, next) {
  ctx.checkHeader('authorization').notEmpty()
  ctx.checkParams('id').notEmpty()
  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
    return
  }
  const result = await Subscription.destroy({ where: { id: ctx.params.id } })
  ctx.status = 200
  ctx.body   = result
})

module.exports = router
