const Hero = require('../../simulator/Hero');
const Citizen = require('../../simulator/Citizen');
const ScenarioEngine = require('../../simulator');
const { HeroAction, CitizenAction } = require('../../simulator/Actions');
const { clearDBAndCloseConn } = require('../../db/setups');
const {ServerSendsToNewSocket, ServerSendsToCitizen} = require('../../simulator/MsgType')
const EventEmitter = require('events')

const eventEmitter = new EventEmitter()
const results = []

const setupDB = async () => {
  // Clear the db
  await clearDBAndCloseConn();
}

const registerListeners = () => {

  eventEmitter.on(ServerSendsToNewSocket.TELL_CITIZEN, data => {
    results.push(ServerSendsToNewSocket.TELL_CITIZEN)
  });
  eventEmitter.on(ServerSendsToCitizen.ACK_RECEIVED_HELP_REQUEST, data => {
    results.push(ServerSendsToCitizen.ACK_RECEIVED_HELP_REQUEST)
  });
};

const createScenario = async () => {
  await setupDB();
  registerListeners()

  const heroes = [];
  console.log(`==== Created ${heroes.length} Hero Clients ====`);

  // Create a citizen client
  const citizens = [new Citizen(1023, eventEmitter)];
  console.log(`==== Created ${citizens.length} Citizen Clients ====`);

  const actions = [
    {
      // Need to ask to be a citizen for server to register citizen msg handlers
      citizen: 0,
      action: CitizenAction.ASK_TO_BE_CITIZEN,
      data: { citizenId: 1 },
    },
    {
      citizen: 0,
      action: CitizenAction.ASK_FOR_HERO_HELP,
    },
  ];
  /*
  Expected Results

  Client:
    Citizen receives TELL_CITIZEN (no payload)
    Citizen receives ACK_RECEIVED_HELP_REQUEST (no payload)

  Server:
    Citizen ASK_TO_BE_CITIZEN received
    Citizen ASK_HERO_FOR_HELP received
    Create incident but no hero to dispatch to
  */

  // Maybe pass in an event subscriber fn (accepts an event emitter and
  // subscribes to events. Events will put their result in single results // object. Tests can check if all results match or are correct)
  const tickInterval = 5;
  return new ScenarioEngine(
    actions,
    tickInterval,
    citizens,
    heroes,
    registerListeners
  );
}

const runScenarioAndTest = async () => {
  await (await createScenario()).run()
  // Check client results
  console.log('results:', results)
  // Check database state
  // Can't currently check server state
}

module.exports = {createScenario, runScenarioAndTest};
