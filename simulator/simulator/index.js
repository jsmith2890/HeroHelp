const { HeroAction, CitizenAction } = require('./Actions');
const EventEmitter = require('events');

class ScenarioEngine {
  // A scenario is a list of action objects
  constructor(
    actions = [],
    tickInterval = 5,
    citizens = [],
    heroes = [],
    registerListeners = () => {}
  ) {
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

    this.eventEmitter = new EventEmitter();
    registerListeners(this.eventEmitter);
    this.eventEmitter.emit('TEST', 'payload');

    // Bindings
    this.run = this.run.bind(this);
    this.tick = this.tick.bind(this);
    this.executeStep = this.executeStep.bind(this);
    this.executeHeroStep = this.executeHeroStep.bind(this);
    this.executeCitizenStep = this.executeCitizenStep.bind(this);
    this.globalTimerHandler = this.globalTimerHandler.bind(this);
  }

  // Run the simulation
  run() {
    this.globalTimer = setInterval(this.globalTimerHandler, 200); //200ms ticks
    // console.log('globalTimer handle:', this.globalTimer)
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
      // console.log('Clearing globalTimer handle:', this.globalTimer)
      clearInterval(this.globalTimer);
      // Shutdown clients after some time
      setTimeout(() => {
        this.heroes.forEach(hero => {
          hero.shutdown();
        });
        this.citizens.forEach(citizen => {
          citizen.shutdown();
        });
      }, 5000);
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
      this.executeHeroStep(currentHero, currentStep);
      return;
    }
    // If have a citizen action for this step
    if (currentStep.hasOwnProperty('citizen')) {
      // Get the citizen at the specified index
      const currentCitizen = this.citizens[currentStep.citizen];
      this.executeCitizenStep(currentCitizen, currentStep);
      return;
    }
    console.log('sleep');
  }

  executeHeroStep(currentHero, currentStep) {
    switch (currentStep.action) {
      case HeroAction.TOGGLE_AVAILABILITY:
        currentHero.toggleStatus(currentStep.data);
        break;
      case HeroAction.TELL_DISPATCH_DECISION:
        currentHero.sendDispatchDecision(currentStep.data);
        break;
      case HeroAction.ASK_TO_BE_HERO:
        currentHero.sendUpgradeAsHero(currentStep.data);
        break;
      case HeroAction.GIVE_HEARTBEAT:
        currentHero.sendHb(currentStep.data);
        break;
      default:
        console.log('unknown hero action ', currentStep.action, ' ignored');
    }
  }

  executeCitizenStep(currentCitizen, currentStep) {
    switch (currentStep.action) {
      case CitizenAction.ASK_FOR_HERO_HELP:
        currentCitizen.sendRequestHelp(currentStep.data);
        break;
      case CitizenAction.ASK_TO_BE_CITIZEN:
        currentCitizen.sendUpgradeAsCitizen(currentStep.data);
        break;
      default:
        console.log('unknown citizen action ', currentStep.action, ' ignored');
    }
  }
}

module.exports = ScenarioEngine;
