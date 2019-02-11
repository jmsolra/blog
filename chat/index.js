const UrlService = require("../urls/shortUrlService")

module.exports = (io, redisClient) => {
  const urlService = UrlService(redisClient)
  io.on("connection", socket => {
    console.log("Cliente WS conectado", socket.id)
    socket.send("chat", {
      text: "Bienvenido!"
    })
    socket.on("sendMessage", (payload, cb) => {
      console.log("Recibido ", payload)
      io.emit("chat", payload)
      cb({ timestamp: Date.now() })
    })
    socket.on("typing", payload => socket.broadcast.emit("typing", payload))
    socket.on("notTyping", () => socket.broadcast.emit("notTyping"))

    socket.on("list:urls", cb => {
      urlService.find().then(cb)
    })
  })
}
