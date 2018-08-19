import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#0a4963',
  },
  image: {
    alignSelf: 'center',
    paddingBottom: 200,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const WaitForDispatch = () => (
  <View style={styles.container}>
    <Image source={require('../assets/logo.png')} style={styles.image} />
    <Text style={styles.text}>Waiting to connect with nearby hero...</Text>
  </View>
);

export default WaitForDispatch;
