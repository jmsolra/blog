const socket = io({
  transports: ["websocket"]
})

const userName = prompt("¿Nombre de usuario?", "Usuario")
const msgInput = document.querySelector("#m")
const btn = document.querySelector("#btn")
const messages = document.querySelector("#messages")
const label = document.querySelector("#label")

function addMessageToList(html) {
  const newMessage = document.createElement("option")
  newMessage.innerHTML = html
  messages.appendChild(newMessage)
}

function enviarMensaje() {
  const texto = msgInput.value
  socket.emit(
    "sendMessage",
    {
      text: texto,
      from: userName
    },
    res => {
      console.log("Recibido en el server a las", res, new Date(res.timestamp))
    }
  )
  msgInput.value = ""
}

btn.addEventListener("click", e => {
  e.preventDefault()
  enviarMensaje()
})

msgInput.addEventListener("keydown", e => {
  socket.emit("typing", userName)
})
msgInput.addEventListener("keyup", e => {
  socket.emit("notTyping")
})

socket.on("chat", function(payload) {
  //console.log("He recibido algo", payload)
  label.innerHTML = ""
  addMessageToList(`<strong>${payload.from}</strong>: ${payload.text}`)
})

socket.on("typing", user => {
  label.innerHTML = "Está escribiendo " + user
})

socket.on("notTyping", user => {
  label.innerHTML = ""
})
