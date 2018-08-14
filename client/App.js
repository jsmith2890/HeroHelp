import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import LandingPage from './components/landingPage'
import HeroSignup from './components/hero-signup'
import {Provider} from 'react-redux'
import store from './store/'
import HeroDuty from './components/hero-duty'

export default class App extends React.Component {
  render() {
       return (
        <Provider store={store}>
          <RootNavigation />
        </Provider>
       )
  }
}

const RootNavigation = createStackNavigator(
  {
    LandingPage: LandingPage,
    HeroSignup: HeroSignup,
    HeroDuty: HeroDuty
  },
  {
    initialRouteName: 'LandingPage',
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
