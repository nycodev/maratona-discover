const express = require("express") 
const server = express()
const routes = require("./routes")


server.set('view engine', 'ejs')

//server.use é usado para adicionar configurações ao servidor
//express.static é um middleware, algo que faz um "intermédio" entre o pedido e a resposta do pedido
server.use(express.static("public"))

//para usar o req.body
server.use(express.urlencoded({ extended: true }))

server.use(routes)

server.listen(3430, () => console.log('rodando normalmente'))