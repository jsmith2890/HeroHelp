const { createSocket } = require('./helper');
const { ServerSendsToCitizen, CitizenSends } = require('./MsgType');

class Citizen {
  constructor(applicationId) {
    // Bindings
    this.recvRequestHelpAck = this.recvRequestHelpAck.bind(this);
    this.recvHeroOnTheWay = this.recvHeroOnTheWay.bind(this);
    this.sendRequestHelp = this.sendRequestHelp.bind(this);

    this.socket = createSocket();
    this.socket.on(ServerSendsToCitizen.ACK_RECEIVED_HELP_REQUEST, evt =>
      this.recvRequestHelpAck(evt)
    );
    this.socket.on(ServerSendsToCitizen.HERO_ENROUTE, evt =>
      this.recvHeroOnTheWay(evt)
    );

    this.lat = 41.9062499;
    this.lon = -87.6515864;
    this.applicationId = applicationId;
  }

  // ========= Handle Incoming Messages =========

  recvRequestHelpAck(evt) {
    console.log('citizen ', this.socket.id, ' recvRequestHelpAck ', evt);
  };

  recvHeroOnTheWay(evt) {
    console.log('citizen', this.socket.id, ' recvHeroOnTheWay ', evt);
  };

  // ========= Handle Outgoing Messages =========

  sendRequestHelp() {
    console.log('citizen ', this.socket.id, 'sendRequestHelp()');
    this.socket.emit(CitizenSends.ASK_FOR_HERO_HELP, {
      applicationId: this.applicationId,
      lat: this.lat,
      lon: this.lon,
    });
  };
}

module.exports = Citizen;
