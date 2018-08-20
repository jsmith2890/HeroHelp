import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { ENV_PATH } from '../../secrets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#0a4963',
  },
  image: {
    alignSelf: 'center',
    width: 300,
    height: 300
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const HeroOnSite = ({ hero }) => {
  let imageUri = {}
  imageUri.uri = ENV_PATH + '/' + hero.heroImage
  console.log(imageUri);
  return (
    <View style={styles.container}>
      <Image source={imageUri} style={styles.image} />
      <Text style={styles.text}>Hero on site</Text>
    </View>
  )
}

export default HeroOnSite;
