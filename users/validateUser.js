module.exports = user => {
  return ['name', 'email'].reduce(
    (acc, prop) => acc && Boolean(user[prop]),
    true
  )
}
