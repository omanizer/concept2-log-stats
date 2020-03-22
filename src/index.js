const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const port = process.env.HTTP_PORT || 8080

const basicStats = require('./calc/basicStats')
const retrieveData = require('./lib/retrieveData')

router.get('/', async (ctx) => {
  let stats = await basicStats()
  ctx.body = JSON.stringify(stats, null, 2)
})

router.get('/refresh', async (ctx) => {
  let result = await retrieveData()
  let stats = await basicStats()
  ctx.body = JSON.stringify({
    result: `Pulled ${result.length} files`,
    ...stats
  }, null, 2)
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port)
console.log('app running on port', port)