var socket  = require('socket.io');
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = socket.listen( server );
var port    = process.env.PORT || 8988;
// var Rfid    = require('./rfid');
// var rfid    = new Rfid(16700, 8454).listen();

// var provider = require('usbprovider');
// var usb = new USBProvider();
// var deviceHandle = null;
// usb.on('usbconnect', function(h) {

//     deviceHandle = h; // cache the handle

//     // set up a data handler (for reading data)
//     deviceHandle.on('data', (data) => {

//         var hex = data.toString('hex');
//         io.sockets.emit( 'scan', { 
//           scan: hex
//         });
//     });

//     usb.poll();

// });


server.listen(port, function () {
  console.log('Server listening at port %d', port);
  
  // rfid.on('scan', function(data) {
  //   console.log(data);
  //   io.sockets.emit( 'scan', { 
  //     scan: data
  //   });
  // });
  
  // rfid.on('input', function(data) {
  //   console.log(data)
  //   io.sockets.emit( 'input', { 
  //     input: data
  //   });
  // });
  
});

io.on('connection', function (socket) {

  socket.on( 'message', function( data ) {
    io.sockets.emit( 'message', { 
      message: data
    });
  });

});


