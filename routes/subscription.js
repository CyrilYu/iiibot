import moment from 'moment'
import Promise from 'bluebird'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import config from '../config'
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

const secretkey = config.secretkey
const topics = ['3C', 'education', 'financial', 'makeups']

router.get(API.QUERY, async function (ctx, next) {
  ctx.checkHeader('authorization').notEmpty()
  ctx.checkQuery('id').notEmpty()
  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
    return
  }
  const parts = ctx.request.header.authorization.split(' ')
  const type  = parts[0]
  const token = parts[1]
  if (type !== 'Bearer') {
    ctx.status = 401
    return
  }
  // verify jwt
  try {
    jwt.verify(token, secretkey)
  } catch (err) {
    ctx.status = 401
    ctx.body   = err.message
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
  const parts = ctx.request.header.authorization.split(' ')
  const type  = parts[0]
  const token = parts[1]
  if (type !== 'Bearer') {
    ctx.status = 401
    return
  }
  // verify jwt
  try {
    jwt.verify(token, secretkey)
  } catch (err) {
    ctx.status = 401
    ctx.body   = err.message
    return
  }
  const user = await User.findOne({ where: { auth_token: token } })
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
  const parts = ctx.request.header.authorization.split(' ')
  const type  = parts[0]
  const token = parts[1]
  if (type !== 'Bearer') {
    ctx.status = 401
    return
  }
  // verify jwt
  try {
    jwt.verify(token, secretkey)
  } catch (err) {
    ctx.status = 401
    ctx.body   = err.message
    return
  }

  const spec = ctx.request.body
  const user = await User.findOne({ where: { auth_token: token } })
  if (!user) {
    ctx.status = 401
    return
  }

  if (!_.includes(topics, spec.topic)) {
    ctx.status = 400
    ctx.body   = 'invalid topic type'
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

router.patch(API.UPDATE, async function (ctx, next) {
  ctx.checkHeader('authorization').notEmpty()
  ctx.checkBody('daily_schedule').notEmpty()

  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
    return
  }

  const parts = ctx.request.header.authorization.split(' ')
  const type  = parts[0]
  const token = parts[1]
  if (type !== 'Bearer') {
    ctx.status = 401
    return
  }
  // verify jwt
  try {
    jwt.verify(token, secretkey)
  } catch (err) {
    ctx.status = 401
    ctx.body   = err.message
    return
  }

  const subscription = await Subscription.findOne({ where: { id: ctx.params.id } })
  if (!subscription) {
    ctx.status = 400
    ctx.body   = 'subscription not found'
    return
  }

  subscription.schedule = ctx.request.body.daily_schedule
  subscription.save()
  ctx.status = 201
  return
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
  const parts = ctx.request.header.authorization.split(' ')
  const type  = parts[0]
  const token = parts[1]
  if (type !== 'Bearer') {
    ctx.status = 401
    return
  }
  // verify jwt
  try {
    jwt.verify(token, secretkey)
  } catch (err) {
    ctx.status = 401
    ctx.body   = err.message
    return
  }
  const result = await Subscription.destroy({ where: { id: ctx.params.id } })
  ctx.status = 200
  ctx.body   = result
})

module.exports = router
