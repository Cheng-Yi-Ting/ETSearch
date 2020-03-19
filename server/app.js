const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const search = require('./search')
var allResults = 0; //所有資料筆數
var limit = 0; //最多limit筆資料
var skip = 0;   //跳過前面skip筆資料
var check = 0;//每次搜尋歸0
var first_skip = 0;
var offset = 10;
var start = 0;
var end = 0;

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  return next()
})


router.get('/search', async (ctx, next) => {
  // ctx.request.quer= > { term: 'javan', offset: '0' }
  const { term, offset } = ctx.request.query
  // console.log(term, offset)
  ctx.body = await search.queryTerm(term, offset)
  // console.log(ctx.body)
  // return
}
)





const port = process.env.PORT || 3001

app
  .use(router.routes())
  .listen(port, err => {
    if (err) console.error(err)
    console.log(`App Listening on Port ${port}`)
  })