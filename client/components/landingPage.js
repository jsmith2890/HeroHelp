import React from 'react';
import { AsyncStorage, Image, StyleSheet } from 'react-native';
import { Button, Text, Container } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { askToBeCitizen } from '../socket';

const styles = StyleSheet.create({
  citizenButton: {
    backgroundColor: '#002239',
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowRadius: 2,
    shadowOpacity: 3.0,
  },
  heroButton: {
    backgroundColor: '#942422',
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowRadius: 2,
    shadowOpacity: 3.0,
  },
});

export default class LandingPage extends React.Component {
  pressHero = () => {
    this.props.navigation.navigate('HeroLogin');
  };

  pressCitizen = async () => {
    const body = {};
    try {
      let citizenId = await AsyncStorage.getItem('CITIZENID');
      console.log('got citizenId of', citizenId);
      if (citizenId !== null) {
        body.citizenId = +citizenId;
      }
    } catch (err) {
      console.error('error fetching citizenid from storage', err);
    }
    askToBeCitizen(body);

    this.props.navigation.navigate('CitizenHome');
  };

  render() {
    return (
      <Container style={{ flex: 1 }}>
        <Grid>
          <Row size={3} style={{ paddingTop: 100, paddingLeft: 30 }}>
            <Image source={require('./assets/logo.png')} />
          </Row>
          <Row size={1}>
            <Col style={{ paddingLeft: 65 }}>
              <Button
                onPress={this.pressCitizen}
                style={styles.citizenButton}
                large
              >
                <Text>Citizen</Text>
              </Button>
            </Col>

            <Col style={{ paddingLeft: 50 }}>
              <Button onPress={this.pressHero} style={styles.heroButton} large>
                <Text>Hero</Text>
              </Button>
            </Col>
          </Row>
        </Grid>
      </Container>
    );
  }
}
