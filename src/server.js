const express = require("express") 
const server = express()
const routes = require("./routes")
const path = require("path")

server.set('view engine', 'ejs')

//const basePath = __dirname + "/view"; <--- essa linha se tornaria desnecessária com o uso do ejs, que por 
//padrão já 'enxerga' a pasta views, porém nesse projeto a mesma está dentro de src, sendo necessária uma
//adaptação, que agora é feita no arquivo server.js de forma um pouco diferente
//--- também por conta dele não é necessária a extensão .html

//mudar a localização da pasta views
server.set('views', path.join(__dirname, 'views'))

//server.use é usado para adicionar configurações ao servidor
//express.static é um middleware, algo que faz um "intermédio" entre o pedido e a resposta do pedido
server.use(express.static("public"))

//para usar o req.body
server.use(express.urlencoded({ extended: true }))

server.use(routes)

server.listen(3430, () => console.log('rodando normalmente'))