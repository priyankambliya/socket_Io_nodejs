const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()

const server = http.createServer(app)
const io = socketio(server)

// =================== set view engine as EJS ================= //

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('app')
})

// =================== SOCKET-IO ================= //
let users = {}
io.on('connection', (socket) => {
    console.log(`user connected`)

    socket.on('new-user', (name) => {
        console.log(name)
        users[socket.id] = name
        socket.broadcast.emit("user-joined", name)
    })

    socket.on("send", message => {
        socket.broadcast.emit("receive", { message, name: users[socket.id] })
    })

    socket.on('disconnect', () => {
        console.log(`user disconnected`)
    })
})

server.listen(2001, () => {
    console.log('server started on port : 2001...')
})  