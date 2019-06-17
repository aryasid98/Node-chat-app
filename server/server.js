const path = require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');

const {generateMessage}=require('./utils/message');
const publicPath=path.join(__dirname , '../public');
const port=process.env.PORT || 3000;

var app=express();
var server=http.createServer(app);
var io=socketIO(server);

app.use(express.static(publicPath)); //middleware

io.on('connection',(socket) => {
  console.log('New User Connected!!');

socket.emit('newMessage', generateMessage('Admin','Welcome to the Chat App'));

socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'));

  socket.on('createMessage',(newMessage ,callback) => { // sent to user from User
    console.log('createMessage',newMessage);
    io.emit('newMessage',generateMessage(newMessage.from,newMessage.text));
    callback('This is from  the server');
    // socket.broadcast.emit('newMessage',{
    //   from: newMessage.from,
    //   text: newMessage.text,
    //   createdAt: new Date().getTime()
    // })
  });


  socket.on('disconnect', () =>{
    console.log('User Disconnected!!');
  })
});

server.listen(port,() => {
  console.log(`Server is up on ${port}`);
});
