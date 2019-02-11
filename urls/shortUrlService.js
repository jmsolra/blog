// const util = require("util")
const promisifyRedis = require("../lib/promisifyRedis")

module.exports = function UrlServiceFactory(client) {
  const URLS_HASH = "urls"
  const SHORT_HASH = "short_urls"

  const redisAsync = promisifyRedis(client)
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

  // crear codigo corto
  function create({ url }) {
    return redisAsync.hget(URLS_HASH, url).then(code => {
      if (code) return code
      return generateShortUrl(url)
    })
  }

  /**
   * Return real URL from short code
   * @param {String} short code
   * @returns {Promise<String>} URL
   */
  function get(shorturl) {
    return redisAsync.hget(SHORT_HASH, shorturl).then(url => {
      if (!url) throw new Error("no encontrado")
      return url
    })
  }

  // listar todos los pares Url : codigo
  function find() {
    return redisAsync.hgetall(URLS_HASH).then(data => {
      if (!data) return []

      return Object.keys(data).map(url => ({
        url,
        shortUrl: data[url]
      }))
    })
  }

  return {
    find,
    create,
    get
  }
}
