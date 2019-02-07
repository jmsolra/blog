const createRouter = require('../lib/createRouter')
const createModel = require('../lib/createModel')
const rejectDups = require('../lib/rejectDuplicate')
const validatePost = require('./validatePost')
const Post = createModel('posts')

const generateDupQuery = data => {
  return data.name ? { name: data.name } : false
}
/* 
const userIsRegistered = (req, res, next) => {
  User.findById(req.body.userId)
  .then(user => {
    if(!user.registered){
      res.status(400).json({ err: 'PAGA'})
    }
    next()
  })
} */

const postsRouter = createRouter({
  model: Post,
  validator: validatePost,
  createMiddlewares: [rejectDups(Post, generateDupQuery)],
  updateMiddlewares: [rejectDups(Post, generateDupQuery)]
})

module.exports = postsRouter
