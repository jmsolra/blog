const util = require('util')
const shortid = require('shortid')
const { Router } = require('express')

/**
 *
 * @param {RedisClient} client
 */
function urlRouter(client) {
  const URLS_HASH = 'urls'
  const SHORT_HASH = 'short_urls'
  const router = Router()
  const promisyFns = ['hget', 'hset', 'hmget', 'hmset']
  const redisAsync = promisyFns.reduce((acc, fnName) => {
    if (typeof client[fnName] === 'function') {
      acc[fnName] = util.promisify(client[fnName]).bind(client)
    } else {
      console.warn('La funcion', fnName, ' te la has inventado')
    }
    return acc
  }, {})
  const generateUrl = url => {
    let shortUrl = shortid.generate()
    return redisAsync
      .hset(URLS_HASH, url, shortUrl)
      .then(() => redisAsync.hset(SHORT_HASH, shortUrl, url))
      .then(() => shortUrl)
  }
  router.post('/', function(req, res) {
    const { url } = req.body

    redisAsync
      .hget(URLS_HASH, url)
      .then(cod => {
        if (cod) return res.send(cod)
        generateUrl(url).then(newCode => res.send(newCode))
      })
      .catch(err => console.error(err))
  })

  return router
}

module.exports = urlRouter
