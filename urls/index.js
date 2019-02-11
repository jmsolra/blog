const util = require("util")
const shortid = require("shortid")
const { Router } = require("express")
const UrlService = require("./shortUrlService")
const VisitService = require("./visitService")

/**
 * Genera el router del servicio de acortamiento de urls
 * @param {RedisClient} client
 */
function urlRouter(client) {
  const router = Router()
  const urlService = UrlService(client)
  const visitService = VisitService(client)

  // CREAR short url
  router.post("/", function(req, res) {
    const { url } = req.body

    urlService
      .create({ url })
      .then(newCode => res.json(newCode))
      .catch(err => {
        console.error(err)
        res.status(400).json({ error: err.message })
      })
  })
  // GET /visits
  //
  router.get("/visits", (req, res) => {
    visitService
      .find()
      .then(results => res.json(results))
      .catch(err => res.status(500).end())
  })

  // GET /urls
  router.get("/", (req, res) => {
    urlService
      .find()
      .then(data => res.json(data))
      .catch(err => {
        console.error(err)
        res.status(500).json({ err: err.message })
      })
  })

  // GET /shortUrl -> URL
  router.get("/:shorturl", function(req, res) {
    const { shorturl } = req.params
    urlService
      .get(shorturl)
      .then(url => visitService.create(url))
      .then(url => res.redirect(url))
      .catch(err => res.status(404).end())
  })

  return router
}

module.exports = urlRouter
