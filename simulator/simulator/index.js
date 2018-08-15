// const chai = require('chai');
// const expect = chai.expect;
// const sinon = require('sinon');
// const sinonChai = require('sinon-chai');
// chai.use(sinonChai)
// const Hero = require('./Hero')
// const Citizen = require('./Citizen')

// const heroes = [];

// const citizens = [];

// let scenarios = [];

// This function gets run on an interval.
// function globalTimerHandler() {
//   // For each hero, run their timer function
//   heroes.forEach(hero => hero.tick());
//   // For each scenario, run their timer function
//   scenarios.forEach(scenario => scenario.timerHandler());
// }

// let globalTimer = setInterval(globalTimerHandler, 200); //200ms ticks

class ScenarioEngine {
  // A scenario is a list of action objects
  constructor(scenario, tickInterval, citizens, heroes) {
    // Entities
    this.citizens = citizens;
    this.heroes = heroes;

    //step timer
    this.tickInterval = tickInterval;
    this.tickCount = 0;

    //local data
    this.scenario = scenario;
    this.step = -1;
    this.completed = false;

    // This function gets run on an interval.
    function globalTimerHandler() {
      // For each hero, run their timer function
      this.heroes.forEach(hero => hero.tick());
      // For each scenario, run their timer function
      this.scenarios.forEach(scenario => scenario.tick());
    }

    this.globalTimer = setInterval(globalTimerHandler, 200); //200ms ticks
  }

  tick = () => {
    this.tickCount++;
    // Only run logic every X number of ticks
    if (this.tickCount % this.tickInterval !== 0) {
      return;
    }

    this.step++;
    console.log('scenario engine timer handler step=', this.step);
    if (this.step < this.scenario.length) {
      this.executeStep();
    } else {
      console.log(' -- scenario has completed');
      this.completed = true;
      clearInterval(this.timer);
    }
  };

  executeStep = () => {
    const currentStep = this.scenario[this.step];
    console.log('execute step ', this.step, ' currentstep=', currentStep);
    if (currentStep.hasOwnProperty('hero')) {
      const currentHero = this.heroes[currentStep.hero];
      switch (currentStep.action) {
        case 't':
          currentHero.toggleStatus();
          break;
        case 'a':
          currentHero.sendDispatchAccepted();
          break;
        default:
          console.log('unknown hero action ', currentStep.action, ' ignored');
      }
      return;
    }
    if (currentStep.hasOwnProperty('citizen')) {
      const currentCitizen = this.citizens[currentStep.citizen];
      switch (currentStep.action) {
        case 'h':
          currentCitizen.sendRequestHelp();
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
  };
}

module.exports = ScenarioEngine;
