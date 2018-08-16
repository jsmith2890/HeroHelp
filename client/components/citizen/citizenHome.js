import React from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';
import { Text, Container } from 'native-base';

const styles = StyleSheet.create({
 container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a4963'
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


  }
});

export default class CitzenHome extends React.Component {

 
  render() {
    return (
      <Container style={styles.container}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Help!</Text>
        </TouchableOpacity>
      </Container>
    );
  }
}
