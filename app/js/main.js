try{
    JET.init( { ID:"WebPageID", Title:"My Web Page", Summary:"A sample page for the JET API" } );
}catch(err){

}

document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#trQ1').addEventListener('click', function(){
        trQ1()
    });

    document.querySelector('#trQ2').addEventListener('click', function(){
        trQ2()
    });

    document.querySelector('#trQ3').addEventListener('click', function(){
        launchEikon()
    });
});

var init = function(){

}

var _onClientAdded = function(){

}


var socket = io.connect();

socket.on('connect', function(value){
    console.log("Socket io connected one the HTML page...");

    $('form').submit(function(){
        socket.emit('chatmessage', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('serverMessage', function(msg){
        console.log("Chat message in the html file ",msg)
        $('#messages').append($('<li>').text("From html. "+msg));
    });

    socket.on('tr_quote_send', function(data){
        console.log("TR received in the  ",data);
        JET.navigate(data);
        $('#messages').append($('<li>').text("Tr data sent. "));
    });

    socket.on("sessionsChanged", function(data){
        console.log("Session Data = ")
    })
});


var jetReadyCallback = function() {
    console.log("JET is loaded and ready to be used");
    var data = {
        target: "popup", // open a popup window
        location: { x: 100, y: 100, width: 300, height: 300 },
        name: "Quote Object", // open a Quote Object
        entities: [{
            type: "COMP",
            "RIC": "TRI.N" // Symbol to use is TRI.N
        }]
    };
    JET.navigate(data);
};

JET.onLoad(jetReadyCallback);

/// Thomson Reuters Code...
tr_OpeneQuote = function(data){
    JET.navigate(data);
};

trQ1 = function(){
    console.log("TR QUITE ONE FIRED...")
    var data = {
        target: "popup", // open a popup window
        location: { x: 100, y: 100, width: 300, height: 300 },
        name: "Quote Object", // open a Quote Object
        entities: [{
            type: "COMP",
            "RIC": "TRI.N" // Symbol to use is TRI.N
        }]
    };

    socket.emit("tr_quote", data);
};

launchEikon = function(){
    fin.desktop.System.launchExternalProcess("C:/\Program Files (x86)/\Thomson Reuters/\Eikon/\Eikon.exe", "", function (result) {
        console.log("Result UUID is " + result.uuid);
    });
}


trQ2 = function(){
    var data = {
        target: "popup", // open a popup window
        location: { x: 400, y: 100, width: 300, height: 300 },
        name: "Quote Object", // open a Quote Object
        entities: [{
            type: "COMP",
            "RIC": "AAPL.O" // Symbol to use is TRI.N
        }]
    };
    socket.emit("tr_quote", data);
};


