// Start server
var express = require('express');
var app = express();
var server = app.listen(3000);

// Start socket.io
var socket = require('socket.io');
var io = socket(server);

io.on('connection', (socket) => {
    
    // New message sended
    socket.on('chat-message', function (data) {
        io.emit('chat-message', data);
        console.log('new message from ' + data.username);
    });
    
});