var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile('./dist/index.html', {"root": __dirname});
});

//io.on('connection', function(socket){
//    console.log('a user connected');
//});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });
});

http.listen(process.env.PORT || 3002, function(){
    console.log('listening on *:3002');
});
