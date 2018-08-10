import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
} from 'react-native';

export default class LandingPage extends React.Component {

  pressHero = () => {
    this.props.navigation.navigate('HeroSignup')
  }

  pressCivilian = () => {

  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.pressCivilian}>
          <Text>Civilian</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.pressHero}>
          <Text>Hero</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  },
  text: {

  }
})
