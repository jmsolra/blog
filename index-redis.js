const redis = require('redis')
const express = require('express')
const urls = require('./urls')

const client = redis.createClient(32768, 'localhost')

client.on('error', err => {
  console.error(err)
})

client.on('connect', function() {
  console.log('Redis client connected')
})

const app = express()

app.use(express.json())

// CREAR URL
app.use('/urls', urls(client))

// GET /shortid

app.listen(3000, () => console.log('Listo en el 3000'))
