const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: String,
  author: String,
  body: String,
  date: { type: Date, default: Date.now },
  tags: [{ type: [String], default: [] }],
  custom: {}
})

const Post = mongoose.model('Post', postSchema, 'posts')
module.exports = Post
