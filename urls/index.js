const util = require('util')
const shortid = require('shortid')
const { Router } = require('express')

/**
 * Genera el router del servicio de acortamiento de urls
 * @param {RedisClient} client
 */
function urlRouter(client) {
  const URLS_HASH = 'urls'
  const SHORT_HASH = 'short_urls'
  const VISITS = 'visits'

  const router = Router()
  const promisyFns = [
    'hget',
    'hset',
    'hgetall',
    'hmset',
    'zincrby',
    'zrevrange'
  ]
  const redisAsync = promisyFns.reduce((acc, fnName) => {
    if (typeof client[fnName] === 'function') {
      acc[fnName] = util.promisify(client[fnName]).bind(client)
    } else {
      console.warn('La funcion', fnName, ' te la has inventado')
    }
    return acc
  }, {})

  /**
   * Generate short code for url
   * @param {String} url
   * @returns {Promise<String>} short code
   */
  const generateShortUrl = url => {
    let shortUrl = shortid.generate()
    return redisAsync
      .hset(URLS_HASH, url, shortUrl)
      .then(() => redisAsync.hset(SHORT_HASH, shortUrl, url))
      .then(() => shortUrl)
  }

  const getUrl = shorturl => {
    return redisAsync.hget(SHORT_HASH, shorturl).then(url => {
      if (!url) throw new Error('no encontrado')
      return redisAsync.zincrby(VISITS, 1, url).then(() => url)
    })
  }

  const getRanking = () => {
    return redisAsync
      .zrevrange(VISITS, 0, -1, 'withscores')
      .then((data = []) => {
        const results = []
        for (let i = 0; i < data.length; i++) {
          if (i % 2 !== 0) continue
          const result = {
            url: data[i],
            visits: data[i + 1]
          }
          results.push(result)
        }
        return results
      })
  }

  // CREAR short url
  router.post('/', function(req, res) {
    const { url } = req.body

    redisAsync
      .hget(URLS_HASH, url)
      .then(code => {
        if (code) return res.json(code)
        generateShortUrl(url).then(newCode => res.json(newCode))
      })
      .catch(err => console.error(err))
  })
  // GET /ranking
  //
  router.get('/ranking', (req, res) => {
    getRanking()
      .then(results => res.json(results))
      .catch(err => res.status(500).end())
  })

  // GET /urls
  router.get('/listall', (req, res) => {
    redisAsync
      .hgetall(URLS_HASH)
      .then(data =>
        Object.keys(data).map(url => ({
          url,
          shortUrl: data[url]
        }))
      )
      .then(data => res.json(data))
  })

  // GET /shortUrl -> URL
  router.get('/:shorturl', function(req, res) {
    const { shorturl } = req.params
    getUrl(shorturl)
      .then(url => res.json(url))
      .catch(err => res.status(404).end())
  })

  return router
}

module.exports = urlRouter
