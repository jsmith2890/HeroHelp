import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { ENV_PATH } from '../../secrets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  image: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  text: {
    color: '#942422',
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  text2: {
    paddingTop: 15,
    color: '#002239',
    fontSize: 25,
    fontWeight: 'bold',
  },
});

const HeroOnSite = ({ hero }) => {
  let imageUri = {};
  imageUri.uri = ENV_PATH + '/' + hero.heroImage;

  return (
    <View style={styles.container}>
      <Image source={imageUri} style={styles.image} />
      <Text style={styles.text}>Hero on site</Text>
      <Text style={styles.text2}>
        When things happen - enjoy them. They're little gifts. Anything you want
        to do you can do here.
      </Text>
      <Text style={styles.text2}>
        When things happen - enjoy them. They're little gifts. Anything you want
        to do you can do here.
      </Text>
      <Text style={styles.text2}>
        When things happen - enjoy them. They're little gifts. Anything you want
        to do you can do here.
      </Text>
    </View>
  );
};

export default HeroOnSite;
