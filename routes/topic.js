import moment from 'moment'
import _ from 'lodash'
import jwt from 'jsonwebtoken'
import config from '../config'
import {
  news as News
} from '../models' 
var router = require('koa-router')()

const API = {
  QUERY: '/query'
}
const secretkey = config.secretkey
const topics = ['3C', 'education', 'financial', 'makeups']

router.post(API.QUERY, async function (ctx, next) {
  // ctx.checkHeader('x-crawler-header').notEmpty().eq('application/crawler.v1')
  ctx.checkHeader('authorization').notEmpty()
  ctx.checkBody('topic').notEmpty()
  ctx.checkBody('keyword').optional()

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
  const topic_id = ctx.request.body.topic
  const keyword  = ctx.request.body.keyword || ''
  if (!_.includes(topics, topic_id)) {
    ctx.status = 400
    ctx.body   = 'invalid topic type'
    return
  }
  const news = await News.findAll({
    where: {
      topic_id,
      title: { $like: `%${keyword}%` } 
    },
    limit: 5
  })
  
  ctx.body = news
})

module.exports = router
