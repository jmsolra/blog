const express = require("express")
const redis = require("redis")
const socketio = require("socket.io")
const http = require("http")

const mongooseClient = require("./mongoose")
const usersRouter = require("./users")
const postsRouter = require("./posts")
const urlsRouter = require("./urls")
const chat = require("./chat")

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
const io = socketio(server)
chat(io)

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html") // Coge de la raíz (__dirname)
})

app.use("/public", express.static("./public"))
app.use(express.json())
app.use("/posts", postsRouter)
app.use("/users", usersRouter)
app.use("/urls", urlsRouter(client))
server.listen(3000, () =>
  console.log("Blog- Express listening on http://localhost:3000")
)
