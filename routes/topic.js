const router = require('koa-router')()
const _ = require('lodash')
import {
  news as News
} from '../models' 


const API = {
  LIST: '/list',
  QUERY: '/query'
}

const topics = ['3c', 'education', 'financial', 'makeups']

router.post(API.QUERY, async function (ctx) {
  ctx.checkBody('topic').notEmpty()
  ctx.checkBody('keyword').optional()

  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
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
