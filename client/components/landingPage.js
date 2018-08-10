import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'native-base';

export default class LandingPage extends React.Component {
  pressHero = () => {
    this.props.navigation.navigate('HeroSignup');
  };

  pressCivilian = () => {};

  render() {
    return (
      <View>
        <Button onPress={this.pressCivilian}>
          <Text>Civilian</Text>
        </Button>
        <Button onPress={this.pressHero}>
          <Text>Hero</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  text: {},
});
