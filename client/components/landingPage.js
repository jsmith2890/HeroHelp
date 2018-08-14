import React from 'react';
import { Image } from 'react-native';
import { Button, Text, Container } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

export default class LandingPage extends React.Component {
  pressHero = () => {
    this.props.navigation.navigate('HeroLogin');
  };

  pressCitizen = () => {
    this.props.navigation.navigate('CitizenHome')
  };

  render() {
    return (
      <Container style={{ flex: 1}}>
        <Grid>
          <Row size={3} style={{ paddingTop: 80, paddingLeft: 10 }}>
            <Image source={require('./assets/logo.png')} />
          </Row>
          <Row size={1}>
            <Col style={{ paddingLeft: 50 }}>
              <Button
                onPress={this.pressCitizen}
                style={{ backgroundColor: '#002239' }}
                large
              >
                <Text>Citizen</Text>
              </Button>
            </Col>

            <Col style={{ paddingLeft: 50 }}>
              <Button
                onPress={this.pressHero}
                style={{ backgroundColor: '#942422' }}
                large
              >
                <Text>Hero</Text>
              </Button>
            </Col>
          </Row>
        </Grid>
      </Container>
    );
  }
}

