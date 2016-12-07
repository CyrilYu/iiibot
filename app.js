require('./models')

const Koa = require('koa')
const app = new Koa()
const cors = require('kcors')
const router = require('koa-router')()
const views = require('koa-views')
const convert = require('koa-convert')
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')()
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const subscription = require('./routes/subscription')
const topic = require('./routes/topic')
const news = require('./routes/news')

// use validate middleware
require('koa-validate')(app)

app.use(cors())

// middlewares
app.use(convert(bodyparser))
app.use(convert(json()))
app.use(convert(logger()))
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'jade'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

router.use('/', index.routes(), index.allowedMethods())
router.use('/users', users.routes(), users.allowedMethods())
router.use('/subscription', subscription.routes(), subscription.allowedMethods())
router.use('/topic', topic.routes(), topic.allowedMethods())
router.use('/news', news.routes(), news.allowedMethods())

app.use(router.routes(), router.allowedMethods())
// response

app.on('error', function(err, ctx){
  console.log(err)
  logger.error('server error', err, ctx)
})


module.exports = app