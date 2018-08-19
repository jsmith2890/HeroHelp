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
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const HeroOnSite = () => (
  <View style={styles.container}>
    <Image source={require('../assets/spiderman.png')} style={styles.image} />
    <Text style={styles.text}>Hero on site</Text>
  </View>
);

export default HeroOnSite;
