const mongoose = require('mongoose')
const urlMongo = 'mongodb://127.0.0.1:27017/blog'

mongoose.connect(urlMongo)

module.exports = mongoose
