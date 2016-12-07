const router = require('koa-router')()
const _ = require('lodash')
import {
  news as News
} from '../models' 


const API = {
  ADD: '/add'
}

const topics = ['3c', 'education', 'financial', 'makeups']

router.post(API.ADD, async function (ctx) {
  ctx.checkBody('topic').notEmpty('topic should not be empty')
  ctx.checkBody('url').notEmpty('url should not be empty')
  ctx.checkBody('title').notEmpty('title should not be empty')

  const errors = ctx.errors
  if (errors) {
    ctx.status = 400
    ctx.body   = errors
    return
  }

  const spec = ctx.request.body
  
  if (!_.includes(topics, spec.topic)) {
    ctx.status = 400
    ctx.body   = 'invalid topic type'
    return
  }

  const news = await News.create({
    topic: spec.topic,
    url: spec.url,
    title: spec.title,
    image_url: spec.image_url
  })
  ctx.body = news
})

module.exports = router
