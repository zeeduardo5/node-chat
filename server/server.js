const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin','New User joined'));

    socket.on('createMessage', (message, callBack) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from,message.text));
        callBack('This is from the server');
    });

    socket.on('createLocationMessage', (coords, callBack) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin' ,coords.latitude ,coords.longitude));
        callBack('This is from the server');
    })


    socket.on('disconnect', () => {
        console.log('User was disconnected from server');
    });
})

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
})