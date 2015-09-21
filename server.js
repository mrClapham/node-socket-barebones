var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var _interVal;


var sessions = new Set();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function(req, res){
    res.sendFile('index.html', {"root": __dirname});
});

//io.on('connection', function(socket){
//    console.log('a user connected');
//});

io.on('connection', function(client){
    console.log('a user connected @3002 in the Server.');
    //_interVal = seInterval(function(){})

    sessions.add(client);

    client.emit('chatmessage', "Hello - I am the server - talking to you...");

    client.on('disconnect', function(){
        console.log('user disconnected');
        sessions.delete(client);
    });

    client.on('chatmessage', function(msg){
        console.log('message: ' + msg);

        sessions.forEach(function (socket) {
            if (socket !== client) {
                socket.emit('serverMessage', "Passed from the server "+msg);
            }
        });
    });
});

http.listen(process.env.PORT || 3002, function(){
    console.log('listening on *:3002');
});
