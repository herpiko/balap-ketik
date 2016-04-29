var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var participants = [];
var race = false;
io.on('connection', function(socket){
  socket.on('start', function(val){
    var race = true;
    io.emit('start', val);
  });
  socket.on('stop', function(val){
    var race = false;
    io.emit('stop', val);
  });
  socket.on('join', function(val){
    if (race) {
      return;
    }
    participants.push(val);
    console.log('joined ' + val);
    io.emit('join', participants);
  });
  socket.on('rematch', function(val){
    if (race) {
      return;
    }
    participants = [];
    io.emit('rematch');
  });
  socket.on('progress', function(val){
    console.log('progress ' + val);
    io.emit('progress', val);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
