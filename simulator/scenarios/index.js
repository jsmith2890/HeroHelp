// All scenarios go here
const scenario1 = require('./scenario1');
const AskToBeHero_Valid = require('./basic_tests/AskToBeHero_Valid');
const AskToBeHero_Invalid = require('./basic_tests/AskToBeHero_Invalid');
const AskToBeCitizen_Valid = require('./basic_tests/AskToBeCitizen_Valid');
const AskForHeroHelp = require('./basic_tests/AskForHeroHelp');
const HeroHeartbeat = require('./basic_tests/HeroHeartbeat');
const HeroTellDispatchDecision = require('./basic_tests/HeroTellDispatchDecision');
const HeroOnSite = require('./basic_tests/HeroOnSite');
const HeroResolveIncident = require('./basic_tests/HeroResolveIncident');

function scenarioRunner() {
  // AskToBeHero_Invalid().run()
  // AskToBeHero_Valid().run()
  // AskToBeCitizen_Valid().run()
  // AskForHeroHelp().run()  // TODO
  // HeroHeartbeat().run(); // TODO
  HeroTellDispatchDecision().run(); // TODO
  // HeroOnSite().run(); // TODO
  // HeroResolveIncident().run();  // TODO
}

scenarioRunner();
