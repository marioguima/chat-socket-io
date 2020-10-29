const express = require('express')
const app = express()

app.use(express.static('public'))

const http = require('http').Server(app)
const serverSocket = require('socket.io')(http)

const porta = 9000

http.listen(porta, function() {
    console.log('Servidor iniciado. Abra o navegador em http://localhost:' + porta);
})

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
})

serverSocket.on('connection', function(socket) {
    socket.on('login', function(nickname) {
        console.log('Cliente conectado: ' + nickname);
        // enviar broadcast (para todos conectados)
        serverSocket.emit('message', `Olá ${nickname}, que bom que você chegou.`);
        socket.nickname = nickname;
    })

    socket.on('message', function(msg) {
        console.log(`Msg recebida do cliente ${socket.nickname}: ${msg}`);

        // enviar broadcast (para todos conectados)
        serverSocket.emit('message', `<strong>${socket.nickname}</strong>: ${msg}`);
    })

    socket.on('typing', function(msg) {
        // enviar broadcast (para todos conectados menos para quem enviou)
        socket.broadcast.emit('typing', msg);
    })
})