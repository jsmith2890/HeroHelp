import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import LandingPage from './components/landingPage'
import HeroSignup from './components/hero-signup'

// Establishes socket connection
import './socket';

export default class App extends React.Component {
  render() {
    // return (
    //   <View style={styles.container}>
    //     <Text>Open up App.js to start working on your app!</Text>
    //     <Text>Changes you make will automatically reload.</Text>
    //     <Text>Shake your phone to open the developer menu.</Text>
    //   </View>


       return <RootNavigation />;

    //);
  }
}

const RootNavigation = createStackNavigator(
  {
    LandingPage: LandingPage,
    HeroSignup: HeroSignup
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
