// Start server
var express = require('express');
var app = express();
var server = app.listen(3000);

// Start socket.io
var socket = require('socket.io');
var io = socket(server);

// Small history of chat
var history = [];

// Add new message in history
function addInHistory(data){
    if(history.length > 100) history.shift();
    history.push(data);
}

// On new connection
io.on('connection', (socket) => {
    
    // New message sended
    socket.on('chat-message', function (data) {
        var msg = {
            ...data,
            created_at: new Date()
        }
        io.emit('chat-message', msg);
        addInHistory(msg);
    });

    // Get history
    socket.on('chat-history', function (){
        socket.emit('chat-history', history);
    });
    
});