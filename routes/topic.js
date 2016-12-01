import moment from 'moment'
import {
  topics as Topic,
  news as News
} from '../models' 
var router = require('koa-router')()

const API = {
  QUERY: '/query'
}

router.get(API.QUERY, async function (ctx, next) {
  // ctx.checkHeader('x-crawler-header').notEmpty().eq('application/crawler.v1')
  ctx.checkHeader('authorization').notEmpty()
  ctx.checkQuery('name').notEmpty()

  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
    return
  }

  const token = ctx.request.header.authorization
  const topic = ctx.request.query.name

  // const topic_id = await Topic.findOne({ where: { name: topic } })
  const news = await News.findAll({ where: { topic_id: 2 }, limit: 2 })
  
  ctx.body = news
})

module.exports = router
