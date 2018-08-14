import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
} from 'react-native';
import {FormLabel, FormInput} from 'react-native-elements'
// import {addNewHero} from '../store'
import {connect} from 'react-redux'
import { Button, Container } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

export default class HeroDuty extends React.Component {
  // constructor() {
  //   super()
  // }

  // handleChange = (event) => {
  //   this.setState({value: event.target.value})
  // }

  render() {
    return (
      <MapView
        provider={ PROVIDER_GOOGLE}
        style={styles.container}
        initialRegion={{
          latitude: 41.89,
          longitude: -87.64,
          latitudeDelta: 0.1,
          longitudeDelta: .05
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  }
})

// const mapDispatchToProps = (dispatch) => ({
//   add: hero => dispatch(addNewHero(hero))
// })

// export default connect(null, mapDispatchToProps)(HeroSignup)
