const path = require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');

const {generateMessage,generateLocationMessage}=require('./utils/message');
const {isRealString}=require('./utils/validation.js')
const publicPath=path.join(__dirname , '../public');
const port=process.env.PORT || 3000;

var app=express();
var server=http.createServer(app);
var io=socketIO(server);

app.use(express.static(publicPath)); //middleware

io.on('connection',(socket) => {
  console.log('New User Connected!!');

socket.on('join',(params,callback)=>{
  if(!isRealString(params.name) || !isRealString(params.room)){
    callback('Name and room are required.');
  }
  socket.join(params.room);
  //socket.leave(params.room);

  //io.emit -> io.to('The Office fans').emit : This is going to send event to everyone in that Room
  //socket.broadcast.emit -> socket.broadcast.to('The Office Fans') : Sends event to everyone except to the user sending this.
  //socket.emit -> For particular user 4

  socket.emit('newMessage', generateMessage('Admin','Welcome to the Chat App'));
  socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined.`));
  callback();
});

socket.on('createMessage',(newMessage ,callback) => { // sent to user from User
    console.log('createMessage',newMessage);
    io.emit('newMessage',generateMessage(newMessage.from,newMessage.text));
    callback();
  });

socket.on('createLocationMessage' , (coords) =>{
  io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
});

  socket.on('disconnect', () =>{
    console.log('User Disconnected!!');
  })
});

server.listen(port,() => {
  console.log(`Server is up on ${port}`);
});
