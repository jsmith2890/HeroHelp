const io = require('socket.io-client');
const { ENV_PATH } = require('../secrets');

if (!ENV_PATH) {
  console.log('You must specify ENV_PATH environment variable');
  process.exit(1);
}

const serverAddr = ENV_PATH; //"http://127.0.0.1:1337";

// Create a websocket connection to the server
module.exports.createSocket = () => {
  // console.log('in createSocket()')
  const socket = io(serverAddr);
  socket.on('connect', () =>
    /*no parms*/ console.log('Socket created with id:', socket.id)
  );
  return socket;
}
