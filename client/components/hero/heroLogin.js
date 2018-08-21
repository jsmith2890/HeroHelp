import React, { Component } from 'react';
import { auth } from '../../store';
import { connect } from 'react-redux';
import { View, StyleSheet, Image } from 'react-native';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
} from 'native-base';

const styles = StyleSheet.create({
  button: {
    width: '80%',
    marginTop: 15,
    alignSelf: 'center',
    backgroundColor: '#002239',
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowRadius: 2,
    shadowOpacity: 1.0,
  },
    image: {
    marginTop: 20,
    alignSelf: 'center',
  },
});

class HeroLogin extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      method: 'login',
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    const { email, password, method } = this.state;
    this.props.login(email, password, method);
  };

  // pressSignUp = () => {
  //   this.props.navigation.navigate('HeroSignUp');
  // };

  render() {
    return (
      <Container>
        <Content>
          <View>
            <Image
              source={require('../assets/logo.png')}
              style={styles.image}
            />
            <Form>
              <Item stackedLabel>
                <Label>Email</Label>
                <Input
                  autoCapitalize="none"
                  value={this.state.email}
                  onChangeText={text => this.setState({ email: text })}
                />
              </Item>
              <Item stackedLabel>
                <Label>Password</Label>
                <Input
                  secureTextEntry
                  value={this.state.password}
                  onChangeText={text => this.setState({ password: text })}
                />
              </Item>
              <Button
                onPress={this.handleSubmit}
                primary
                block
                style={styles.button}
              >
                <Text>Login</Text>
              </Button>
            </Form>
          </View>
          {/* <Button onPress={this.pressSignUp} danger block style={styles.button}>
            <Text>Sign Up</Text>
          </Button> */}
        </Content>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: (email, password, method) => dispatch(auth(email, password, method)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(HeroLogin);
