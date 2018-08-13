import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import store from './store/';
import {LandingPage, HeroSignUp, CitizenHome, HeroLogin} from './components'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RootNavigation />
      </Provider>
    );
  }
}

const RootNavigation = createStackNavigator(
  {
    LandingPage,
    HeroSignUp,
    CitizenHome,
    HeroLogin,
  },
  {
    initialRouteName: 'LandingPage',
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
