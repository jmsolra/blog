const createRouter = require('../lib/createRouter')
//const createModel = require('../lib/createModel')
const validateUser = require('./validateUser')
const rejectDups = require('../lib/rejectDuplicate')
const User = require('../models/user')

const generateDupQuery = data => {
  return data.email ? { email: data.email } : false
}

module.exports = createRouter({
  model: User,
  validator: validateUser,
  createMiddlewares: [rejectDups(User, generateDupQuery)],
  updateMiddlewares: [rejectDups(User, generateDupQuery)]
})
