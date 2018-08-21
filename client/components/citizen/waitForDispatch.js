import React from 'react';
import { StyleSheet, Image, Text } from 'react-native';
import { Spinner, Grid, Row } from 'native-base';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    paddingTop: 50,
  },
  text: {
    color: '#002239',
    fontSize: 28,
    fontWeight: 'bold',
  },
  textContainer: {
    paddingTop: 140,
    flexDirection: 'column',
  },
});

const WaitForDispatch = () => (
  <Grid style={styles.container}>
    <Row style={styles.image}>
      <Image source={require('../assets/logo.png')} />
    </Row>
    <Row style={styles.textContainer}>
      <Text style={styles.text}>Connecting with nearby hero</Text>
      <Spinner color="#002239" />
    </Row>
  </Grid>
);

export default WaitForDispatch;
