const { HeroAction, CitizenAction } = require('./Actions');

class ScenarioEngine {
  // A scenario is a list of action objects
  constructor(actions = [], tickInterval = 5, citizens = [], heroes = []) {
    // Entities
    this.citizens = citizens;
    this.heroes = heroes;

    //step timer
    this.tickInterval = tickInterval;
    this.tickCount = 0;

    //local data
    this.actions = actions;
    this.step = -1;
    this.completed = false;

    // Bindings
    this.run = this.run.bind(this);
    this.tick = this.tick.bind(this);
    this.executeStep = this.executeStep.bind(this);
    this.globalTimerHandler = this.globalTimerHandler.bind(this);
  }

  // Run the simulation
  run() {
    this.globalTimer = setInterval(this.globalTimerHandler, 200); //200ms ticks
  }

  // This function gets run on an interval.
  globalTimerHandler() {
    // For each hero, run their tick function (which is just a heartbeat atm)
    // this.heroes.forEach(hero => hero.tick());
    // For each scenario, run their timer function
    // this.scenarios.forEach(scenario => scenario.tick());
    this.tick();
  }

  // Run a tick of the scenario
  tick() {
    this.tickCount++;
    // Only run logic every X number of ticks
    if (this.tickCount % this.tickInterval !== 0) {
      return;
    }

    this.step++;
    // console.log();
    // console.log('Scenario Engine. Step =', this.step);
    if (this.step < this.actions.length) {
      this.executeStep();
    }
    // If we've finished all the actions, stop the simulator
    else {
      console.log(' ------- scenario has completed -------');
      this.completed = true;
      clearInterval(this.globalTimer); //this.timer);
    }
  }

  // Execute the next action in the list of actions
  executeStep() {
    const currentStep = this.actions[this.step];
    console.log();
    console.log('EXECUTING STEP ', this.step, ' currentstep=', currentStep);
    // If have a hero action for this step
    if (currentStep.hasOwnProperty('hero')) {
      // Get the hero at the specified index
      const currentHero = this.heroes[currentStep.hero];
      switch (currentStep.action) {
        case HeroAction.TOGGLE_AVAILABILITY:
          currentHero.toggleStatus();
          break;
        case HeroAction.ACCEPT_DISPATCH:
          currentHero.sendDispatchAccepted();
          break;
        case HeroAction.ASK_TO_BE_HERO:
          currentHero.sendUpgradeAsHero();
          break;
        default:
          console.log('unknown hero action ', currentStep.action, ' ignored');
      }
      return;
    }
    // If have a citizen action for this step
    if (currentStep.hasOwnProperty('citizen')) {
      // Get the citizen at the specified index
      const currentCitizen = this.citizens[currentStep.citizen];
      switch (currentStep.action) {
        case CitizenAction.ASK_FOR_HERO_HELP:
          currentCitizen.sendRequestHelp();
          break;
        case CitizenAction.ASK_TO_BE_CITIZEN:
          currentCitizen.sendUpgradeAsCitizen();
          break;
        default:
          console.log(
            'unknown citizen action ',
            currentStep.action,
            ' ignored'
          );
      }
      return;
    }
    console.log('sleep');
  }
}

module.exports = ScenarioEngine;
