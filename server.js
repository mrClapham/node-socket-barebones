var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var sessions = new Set();
var isEikonOpen = function(){
    var hasEikon = false;
    sessions.forEach(function(d){
        if (String(d.handshake.headers.cookie).toLowerCase().search("eikon") != -1) {
            hasEikon = true;
        }
    });
    return hasEikon;
};

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function(req, res){
    res.sendFile('index.html', {"root": __dirname});
});


io.on('connection', function(client){
    console.log('a user connected @3002 in the Server.');
    //_interVal = seInterval(function(){})
    sessions.add(client);

    console.log("isEikonOpen : ",isEikonOpen());

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


    client.on('tr_quote', function(data){
        console.log('tr_quote: ' + data);

        sessions.forEach(function (socket) {
            if (socket !== client) {
                socket.emit('tr_quote_send', data);
            }
        });
    });

});

http.listen(process.env.PORT || 3002, function(){
    console.log('listening on *:3002');
});
