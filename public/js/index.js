var socket=io();

socket.on('connect' ,function () {
  console.log('Connected to server');


  socket.emit('createMessage',{
    from:'Jen',
    text: 'HII JOE!!!'
  });
});



socket.on('disconnect',function ()  {
  console.log('Server disconnected')
});


socket.on('newEmail', function (email) {
  console.log('New Email',email);
});

socket.on('newMessage' , function (message){
  console.log('New Message',message);
});
