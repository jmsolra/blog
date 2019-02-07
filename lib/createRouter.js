const express = require('express')

const noValidator = () => true

const makeModelRouter = function({
  model,
  validator = noValidator,
  createMiddlewares = [],
  updateMiddlewares = [] // ...updateMiddlewares porque es array de mw
}) {
  const router = express.Router()

  // generar middleware que extrae los datos a partir de los parámetros de la ruta
  const makewithResourceById = (idParam = 'id', reqProp = 'resource') => {
    return (req, res, next) => {
      const resourceId = req.params[idParam]
      model
        .findById(resourceId)
        .then(resource => {
          req[reqProp] = resource
          next()
        })
        .catch(err => res.status(404).json({ error: err }))
    }
  }

  const extractResource = makewithResourceById('id')

  // ejemplo de "middleware" definido en función aparte
  function listAll(req, res) {
    model.findAll(req.query).then(data => {
      res.json(data)
    })
  }

  router.get('/', listAll)

  router.get('/:id', extractResource, function(req, res) {
    res.json(req.resource)
  })

  router.post('/', ...createMiddlewares, async function(req, res) {
    const data = req.body
    if (!validator(data)) {
      return res.status(406).json({ error: 'not valid data' })
    }
    model
      .create(data)
      .then(newResource => res.json(newResource))
      .catch(err => res.status(406).json({ error: err.message }))
  })

  router.put('/:id', ...createMiddlewares, extractResource, function(req, res) {
    const existingData = req.resource
    const newData = req.body
    if (!validator({ ...existingData, ...newData })) {
      return res.status(406).json({ error: 'not valid data' })
    }
    model
      .update(existingData, newData)
      .then(updatedResource => res.json(updatedResource))
      .catch(err => res.status(406).json({ error: err }))
  })

  router.delete('/:id', extractResource, function(req, res) {
    model
      .remove(req.resource._id)
      .then(mssg => res.status(200).json(mssg))
      .catch(err => res.status(406).json({ error: err }))
  })
  return router
}

module.exports = makeModelRouter
