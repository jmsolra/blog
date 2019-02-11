module.exports = io => {
  io.on("connection", socket => {
    console.log("Cliente WS conectado", socket.id)
    socket.send("chat", {
      text: "Bienvenido!"
    })
    socket.on("sendMessage", payload => {
      console.log("Recibido ", payload)
      io.emit("chat", payload)
    })
    socket.on("typing", payload => socket.broadcast.emit("typing", payload))
    socket.on("notTyping", () => socket.broadcast.emit("notTyping"))
  })
}
