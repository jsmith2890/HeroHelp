import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
} from 'react-native';
import {FormLabel, FormInput} from 'react-native-elements'
import {addNewHero} from '../store'
import {connect} from 'react-redux'

class HeroSignup extends React.Component {
  constructor() {
    super()
    this.state = {
      value: ''
    }
  }

  // handleChange = (event) => {
  //   this.setState({value: event.target.value})
  // }

  handleSubmit = (event) => {
    event.preventDefault()
    console.log('this.state', this.state.value)
    this.props.add(this.state.value)
  }

  render() {
    return (
      <View>
         <Text>On hero signup</Text>
         <TextInput
            onChangeText={(inputVal) => this.setState({value: inputVal})}
            value={this.state.value}
         />
         <TouchableOpacity onPress={this.handleSubmit}>
            <Text>Submit</Text>
         </TouchableOpacity>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  add: hero => dispatch(addNewHero(hero))
})

export default connect(null, mapDispatchToProps)(HeroSignup)
