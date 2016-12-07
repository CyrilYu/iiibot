const router = require('koa-router')()
const Promise = require('bluebird')
const _ = require('lodash')
import { authenticate } from './utils'
import {
  users as User,
  subscriptions as Subscription,
  news as News
} from '../models'

const API = {
  QUERY: '/query',
  LIST: '/list',
  ADD: '/add',
  UPDATE: '/:id',
  DELETE: '/:id'
}

const topics = ['3c', 'education', 'financial', 'makeups']

router.get(API.QUERY, async function (ctx) {
  ctx.checkHeader('authorization').notEmpty()
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

router.get(API.LIST, async function (ctx) {
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
  const credential = authenticate(type, token)
  if (!credential.isValid) {
    ctx.status = credential.errCode
    ctx.body   = credential.message
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

router.post(API.ADD, async function (ctx) {
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
  const credential = authenticate(type, token)
  if (!credential.isValid) {
    ctx.status = credential.errCode
    ctx.body   = credential.message
    return
  }

  const spec = ctx.request.body
  const user = await User.findOne({ where: { auth_token: token } })
  if (!user) {
    ctx.status = 401
    ctx.body   = 'User not found'
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
    daily_schedule: spec.daily_schedule
  }
  const sub = await Subscription.create(obj)
  ctx.status = 201
  ctx.body   = sub
})

router.patch(API.UPDATE, async function (ctx) {
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
  const credential = authenticate(type, token)
  if (!credential.isValid) {
    ctx.status = credential.errCode
    ctx.body   = credential.message
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

router.delete(API.DELETE, async function (ctx) {
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
  const credential = authenticate(type, token)
  if (!credential.isValid) {
    ctx.status = credential.errCode
    ctx.body   = credential.message
    return
  }

  const result = await Subscription.destroy({ where: { id: ctx.params.id } })
  ctx.status = 200
  ctx.body   = result
})


module.exports = router
