import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a4963',
  },
  button: {
    backgroundColor: '#942422',
    borderRadius: 150,
    height: 300,
    width: 300,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 100,
  },
});

const HelpButton = ({ pressHelpHandler }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={pressHelpHandler} style={styles.button}>
      <Text style={styles.buttonText}>Help!</Text>
    </TouchableOpacity>
  </View>
);

export default HelpButton;
