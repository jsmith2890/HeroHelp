const io = require('socket.io-client')
// const chai = require('chai');
// const expect = chai.expect;
// const sinon = require('sinon');
// const sinonChai = require('sinon-chai');
// chai.use(sinonChai)

const serverAddr = "http://127.0.0.1:1337";

const heroes = []

const citizens = []

let scenarios = []

function createSocket() {
  const socket = io(serverAddr);
  socket.on('connect', (/*no parms*/) => console.log('createSocket:', socket.id))
  return socket
}

function globalTimerHandler() {
  heroes.forEach(h => h.timerHandler())
  scenarios.forEach(s => s.timerHandler())

}

let globalTimer = setInterval(globalTimerHandler, 200); //200ms ticks

class Hero {
  constructor(numTicks) {
    this.socket = createSocket();
    this.socket.on('ACK_RECEIVED_HEARTBEAT', (evt) => this.recvHbAck(evt))
    this.socket.on('GIVE_DISPATCH', (evt) => this.recvDispatch(evt))

    //hb timer
    this.numTicks = numTicks; //number of timer ticks between taking action
    this.tickCount = 0;
    this.timerHandler = this.timerHandler.bind(this)

    //superhero outgoing messages
    this.sendHb = this.sendHb.bind(this);
    this.sendDispatchAccepted = this.sendDispatchAccepted.bind(this)

    //superhero incoming messages
    this.recvHbAck = this.recvHbAck.bind(this);
    this.recvDispatch = this.recvDispatch.bind(this);

    //superhero buttons
    this.toggleStatus = this.toggleStatus.bind(this)

    //superhero local data
    this.status = 'available'
    this.lat = 41.895367
    this.lon = -87.638977
    this.incidentLat = 0
    this.incidentLon = 0
    this.incidentId = 0
  }

  toggleStatus() {
    console.log('hero ', this.socket.id, 'toggleStatus()')
    if (this.status === 'available') {
      this.status = 'unavailable'
    } else {
      this.status = 'available'
    }
    this.sendHb();
  }

  timerHandler() {
    this.tickCount++;
    if (this.tickCount % this.numTicks !== 0) {
      return;
    }
    console.log('hero ', this.socket.id, ' timerHandler()')
    this.sendHb()
  }

  sendHb() {
    console.log('hero ', this.socket.id, ' sendHb()')
    this.socket.emit('GIVE_HEARTBEAT', { lat: this.lat, lon: this.lon, status: this.status })
  }

  recvHbAck(evt) {
    console.log('hero ', this.socket.id, ' recvHbAck ', evt)
  }

  recvDispatch(evt) {
    console.log('hero ', this.socket.id, ' recvDispatch ', evt)
    this.incidentLat = evt.lat;
    this.incidentLon = evt.lon;
    this.incidentId = evt.incidentId;
  }

  sendDispatchAccepted() {
    console.log('hero ', this.socket.id, ' sendDispatchAccepted ')
    this.socket.emit('TELL_DISPATCH_DECISION', { incidentId: this.incidentId, status:'accepted' })
  }

}

class Citizen {
  constructor(applicationId) {
    this.socket = createSocket();
    this.socket.on('ACK_RECEIVED_HELP_REQEUEST', (evt) => this.recvRequestHelpAck(evt))
    this.socket.on('HERO_ENROUTE', (evt) => this.recvHeroOnTheWay(evt))

    this.sendRequestHelp = this.sendRequestHelp.bind(this);
    this.recvRequestHelpAck = this.recvRequestHelpAck.bind(this);
    this.recvHeroOnTheWay = this.recvHeroOnTheWay.bind(this);

    this.lat = 41.9062499
    this.lon = -87.6515864
    this.applicationId = applicationId
  }

  sendRequestHelp() {
    console.log('citizen ', this.socket.id, 'sendRequestHelp()');
    this.socket.emit('ASK_FOR_HERO_HELP', { applicationId: this.applicationId, lat: this.lat, lon: this.lon })
  }

  recvRequestHelpAck(evt) {
    console.log('citizen ', this.socket.id, ' recvRequestHelpAck ', evt)
  }

  recvHeroOnTheWay(evt) {
    console.log('citizen', this.socket.id, ' recvHeroOnTheWay ', evt)
  }
}

class ScenarioEngine {
  constructor(scenario, numTicks) {

    //step timer
    this.timerHandler = this.timerHandler.bind(this)
    this.numTicks = numTicks;
    this.tickCount = 0;

    //bindings
    this.timerHandler = this.timerHandler.bind(this);
    this.executeStep = this.executeStep.bind(this);

    //local data
    this.scenario = scenario;
    this.step = -1;
    this.completed = false;
  }

  timerHandler() {
    this.tickCount++
    if (this.tickCount % this.numTicks !== 0) {
      return
    }

    this.step++
    console.log('scenario engine timer handler step=', this.step)
    if (this.step < this.scenario.length) {
      this.executeStep()
    } else {
      console.log(' -- scenario has completed')
      this.completed = true;
      clearInterval(this.timer)
    }
  }

  executeStep() {
    const currentStep = this.scenario[this.step]
    console.log('execute step ', this.step, ' currentstep=', currentStep)
    if (currentStep.hasOwnProperty('hero')) {
      const currentHero = heroes[currentStep.hero];
      switch (currentStep.action) {
        case 't':
          currentHero.toggleStatus()
          break;
        case 'a':
          currentHero.sendDispatchAccepted()
          break;
        default: console.log('unknown hero action ', currentStep.action, ' ignored')
      }
      return;
    }
    if (currentStep.hasOwnProperty('citizen')) {
      const currentCitizen = citizens[currentStep.citizen];
      switch (currentStep.action) {
        case 'h':
          currentCitizen.sendRequestHelp()
          break;
        default: console.log('unknown citizen action ', currentStep.action, ' ignored')
      }
      return;
    }
    console.log('sleep')
  }
}

//create a group of heroes

heroes.push(new Hero(5))
heroes.push(new Hero(5))
//heroes.push(new Hero())

//create a citizen
citizens.push(new Citizen(1023));

let scenario = []
//mark hero 0 unavailable, force upcoming request to hero 1
let step = { hero: 0, action: 't' }
scenario.push(step);
//citizen requests help, expect ack back to citizen, dispatch message to go to hero 1
step = { citizen: 0, action: 'h' }
scenario.push(step)
//have hero 1 accept the dispatch, expect suphero-on-the-way to citizen from hero 1
step = { hero: 1, action: 'a' }
scenario.push(step);
step = {} //sleep 1 cycle
scenario.push(step)

const scenario1 = new ScenarioEngine(scenario, 5)

scenarios.push(scenario1)
