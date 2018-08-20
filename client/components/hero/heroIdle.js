import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps'
import ToggleSwitch from 'toggle-switch-react-native'
import {isAvailable} from '../../socket'
import RetroMapStyles from '../assets/mapStyle.json'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  switch: {
    marginTop: 10,
    marginBottom: 10
  },
  mapIdle: {
    height: '80%',
    width: '100%'
  }
})

export default class HeroIdle extends Component {
  state = {
    isOnToggleSwitch: false
  }
  render() {
    const {initialLocation} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.switch}>
          <ToggleSwitch
            isOn={this.state.isOnToggleSwitch}
            onColor="green"
            offColor="red"
            // label="On Duty"
            labelStyle={{color: 'black', fontWeight: '900'}}
            size="large"
            onToggle={isOnToggleSwitch => {
              isAvailable(isOnToggleSwitch)
              this.setState({isOnToggleSwitch})
            }}
          />
        </View>
        <MapView
          provider={PROVIDER_GOOGLE}
          customMapStyle={RetroMapStyles}
          style={styles.mapIdle}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          initialRegion={{
            latitude: initialLocation.coords.latitude,
            longitude: initialLocation.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.025
          }}
        />
      </View>
    )
  }
}
