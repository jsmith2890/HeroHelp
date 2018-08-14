import io from 'socket.io-client';
import {ENV_PATH} from '../secrets'

// import { ServerSends, ClientListensFor } from './MsgType';

// import SocketIOClient from 'socket.io-client';
// constructor(props) {
//   super(props);
//   const host = config.server.host;
//   const port = config.server.port;
//   this.socket = SocketIOClient(`http://${host}:${port}`);
//   this.socket.emit('init', {
//     senderId: this.props.user.myId,
//   });
//   this.socket.on('message', message => {
//     const newMessage = {
//       createdAt: message.createdAt,
//       text: message.text,
//       userId: message.senderId,
//       _id: message.msgId,
//     };
//     this.props.onSendMessage(message.conversationId, newMessage);
//   });
// }


// Verify that the Server websocket address is defined
if (!ENV_PATH) {
  console.log(
    'You must specify ENV_PATH environment variable'
  );
  process.exit(1);
}

// Of the form: http://55.5.5.5:8080
console.log('Creating a socket connection to server:', ENV_PATH);

const socket = io(ENV_PATH);

socket.on('connect', () => {
  console.log('websocket Connected!');
});

// Dispatch to the appropriate handler
// socket.on(ClientListensFor.SERVER_UPDATE, serverMsg => {
//   console.log('Received socket msg from server:', serverMsg);
//   const data = serverMsg.data;

//   }
// });

export default socket;
