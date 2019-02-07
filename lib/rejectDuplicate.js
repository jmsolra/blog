const rejectDuplicates = (model, generateQuery) => (req, res, next) => {
  const data = req.body
  const query = generateQuery(data)
  if (!query) return next()

  model.find(query).then(data => {
    if (data.length > 0) {
      return res.status(406).json({ error: 'documento duplicado' })
    }
    return next()
  })
}

module.exports = rejectDuplicates
