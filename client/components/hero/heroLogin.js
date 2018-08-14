import React, { Component } from 'react';
import { auth } from '../../store';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
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

  pressSignUp = () => {
    this.props.navigation.navigate('HeroSignUp');
  };

  render() {
    return (
      <Container>
        <Content>
          <View>
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
          <Button onPress={this.pressSignUp} danger block style={styles.button}>
            <Text>Sign Up</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: '80%',
    marginTop: 10,
    alignSelf: 'center',
  },
});

const mapDispatchToProps = dispatch => {
  return {
    login: (email, password, method) => dispatch(auth(email, password, method)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(HeroLogin);
