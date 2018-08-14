import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { addNewHero } from '../../store';
import { connect } from 'react-redux';
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

class HeroSignUp extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    console.log('this.state', this.state.value);
    this.props.add(this.state.value);
  };

  render() {
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Content>
          <View>
            <Form>
              <Item stackedLabel>
                <Label>Name</Label>
                <Input
                  autoFocus
                  autoCapitalize="none"
                  onChangeText={inputVal => this.setState({ value: inputVal })}
                  value={this.state.value}
                />
              </Item>
              <Button block style={styles.button} onPress={this.handleSubmit}>
                <Text>Submit</Text>
              </Button>
            </Form>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  add: hero => dispatch(addNewHero(hero)),
});

export default connect(
  null,
  mapDispatchToProps,
)(HeroSignUp);

const styles = StyleSheet.create({
  button: {
    width: '80%',
    marginTop: 10,
    alignSelf: 'center',
  },
});
