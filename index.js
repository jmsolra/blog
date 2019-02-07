const express = require('express')
const mongoClient = require('./mongo')
const usersRouter = require('./users')
const postsRouter = require('./posts')
const app = express()

mongoClient
  .connect()
  .then(client => {
    console.log('Conectado')
  })
  .catch(err => console.error('Error conexion Mongo: ', err))

app.use(express.json())
app.use('/posts', [postsRouter])

//app.use('/posts', postsRouter)

app.use('/users', usersRouter)
app.listen(3000, () =>
  console.log('Blog- Express listening on http://localhost:3000')
)
