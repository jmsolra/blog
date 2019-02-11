const express = require("express")
const redis = require("redis")
const io = require("socket.io")
const http = require("http")

const mongooseClient = require("./mongoose")
const usersRouter = require("./users")
const postsRouter = require("./posts")
const urlsRouter = require("./urls")

const app = express()
const server = http.Server(app)
// Mongo
const dbConection = mongooseClient.connection
dbConection.on("error", err => console.error(err))
dbConection.on("open", () => console.log("Conectado a mongo"))

// Redis
const client = redis.createClient()
client.on("error", err => {
  console.error(err)
})

client.on("connect", function() {
  console.log("Redis client connected")
})

// Socket.io
io(server)

app.use(express.json())
app.use("/posts", postsRouter)
app.use("/users", usersRouter)
app.use("/urls", urlsRouter(client))
server.listen(3000, () =>
  console.log("Blog- Express listening on http://localhost:3000")
)
