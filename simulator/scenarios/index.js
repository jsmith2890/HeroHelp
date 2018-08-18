// All scenarios go here
const scenario1 = require('./scenario1')
const AskToBeHero_Valid = require('./basic_tests/AskToBeHero_Valid')
const AskToBeHero_Invalid = require('./basic_tests/AskToBeHero_Invalid')
const AskToBeCitizen_Valid = require('./basic_tests/AskToBeCitizen_Valid')
const AskForHeroHelp = require('./basic_tests/AskForHeroHelp')
const HeroHeartbeat = require('./basic_tests/HeroHeartbeat')
const HeroTellDispatchDecision = require('./basic_tests/HeroTellDispatchDecision')
const HeroOnSite = require('./basic_tests/HeroOnSite')
const HeroResolveIncident = require('./basic_tests/HeroResolveIncident')
const HeroEnroute_Far = require('./basic_tests/HeroEnroute_Far')
const HeroEnroute_MovesThere = require('./basic_tests/HeroEnroute_MovesThere')

async function scenarioRunner() {

  // ====== Up-to-date tests ===========
  // await AskForHeroHelp(); // seems to work
  // await HeroHeartbeat(); // mostly works. Need to send status back
  // await HeroEnroute_Far()
  await HeroEnroute_MovesThere()

  // ====== Tests that need updating to work =========
  // AskToBeHero_Invalid().run()
  // AskToBeHero_Valid().run()
  // AskToBeCitizen_Valid().run()
  // AskForHeroHelp().run() // seems to work
  // HeroHeartbeat().run() // mostly works. Need to send status back
  // HeroTellDispatchDecision().run(); // dispatch not working
  // HeroOnSite().run(); // TODO
  // HeroResolveIncident().run();  // TODO
}

scenarioRunner()
