const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('join', (params, callBack) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callBack('Name and Room are required.');
        }

        socket.join(params.room);

        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`));
        callBack();
    })

    socket.on('createMessage', (message, callBack) => {
        var user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callBack('This is from the server');
    });

    socket.on('createLocationMessage', (coords, callBack) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
       
        callBack('This is from the server');
    })


    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('ADMIN', `${user.name} left the room.`));
        }
        console.log('User was disconnected from server');
    });
})

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
})