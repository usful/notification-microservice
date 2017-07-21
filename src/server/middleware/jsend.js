const jsend = require('jsend')

module.exports = function jsendMiddlewareFactory() {
  return async function jsendMiddleware(ctx, next) {
    ctx.success = data => {
      ctx.response.body = jsend.success(data)
    }

    ctx.fail = data => {
      ctx.response.body = jsend.fail(data)
    }

    ctx.error = data => {
      ctx.response.body = jsend.error(data)
    }

    await next()
  }
}
