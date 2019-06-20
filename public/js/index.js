var socket=io();

socket.on('connect' ,function () {
  console.log('Connected to server');
//   socket.emit('createMessage',{
//     from:'Jen',
//     text: 'HII JOE!!!'
//   });
});

socket.on('disconnect',function ()  {
  console.log('Server disconnected')
});

socket.on('newMessage' , function (message){
  var formattedTime=moment(message.createdAt).format('hh:mm a');
  console.log('New Message', message);
  var li=jQuery('<li></li>');
  li.text(`${formattedTime} ${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function(message){
  var formattedTime=moment(message.createdAt).format('hh:mm a')
  var li=jQuery('<li></li>');
  var a= jQuery('<a target="_blank">My current Location</a>');

  li.text(`${formattedTime} ${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit', function(e){
  e.preventDefault();

  var messageTextbox=jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  },function () {
    messageTextbox.val('');
  });
});


var locationButton= jQuery('#send-location');
locationButton.on('click', function () {
  if(!navigator.geolocation) {
    return alert('Geolocatio not supported by your browser!.');
  }

  locationButton.attr('disabled','disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage',{
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  },function() {
    locationButton.removeAttr('disabled').text('Send Location');
    return alert('Unable to fetch the location');
  });
});
