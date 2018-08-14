import React, { Component } from 'react';
import { auth } from '../../store';
import { connect } from 'react-redux';
import { View } from 'react-native';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text
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

  render() {
    return (
      <Container >
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
              <Button primary block onPress={this.handleSubmit}>
                <Text>Login</Text>
              </Button>
            </Form>
          </View>
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
