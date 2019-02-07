const express = require('express')
const mongoClient = require('./mongo')
const mongooseClient = require('./mongoose')
const usersRouter = require('./users')
const postsRouter = require('./posts')
const app = express()

const dbConection = mongooseClient.connection
dbConection.on('error', err => console.error(err))
dbConection.on('open', () => console.log('Conectado a mongo'))

app.use(express.json())
app.use('/posts', [postsRouter])

//app.use('/posts', postsRouter)

app.use('/users', usersRouter)
app.listen(3000, () =>
  console.log('Blog- Express listening on http://localhost:3000')
)
