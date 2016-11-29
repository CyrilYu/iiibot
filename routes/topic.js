import moment from 'moment'
import { topics as Topic } from '../models' 
var router = require('koa-router')()

const API = {
  LIST: '/list'
}

router.get(API.LIST, async function (ctx, next) {
  const topics = await Topic.findAll({ attributes: ['id', 'name'] })
  ctx.body = topics
})

module.exports = router
