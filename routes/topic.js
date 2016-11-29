import moment from 'moment'
import { topics as Topic } from '../models' 
var router = require('koa-router')()

const API = {
  LIST: '/list'
}

router.get(API.LIST, async function (ctx, next) {
  // ctx.checkHeader('auth_token').notEmpty('auth token should not be empty.')
  // const errors = ctx.errors
  // if (errors) {
  //   ctx.status = 400
  //   ctx.body = errors
  //   return
  // }
  
  const topics = await Topic.findAll({ attributes: ['id', 'name'] })
  ctx.body = topics
})

module.exports = router
