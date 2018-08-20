import React from 'react'
import {StyleSheet, View, Text, Alert, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {Container, Header, Content, Button, Icon} from 'native-base'
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps'
import ToggleSwitch from 'toggle-switch-react-native'
import {isAvailable} from '../../socket'
import {Constants, Location, Permissions} from 'expo'
import {resolveIncident} from '../../socket/index'
import MapViewDirections from 'react-native-maps-directions'
import RetroMapStyles from '../assets/mapStyle.json'

const GOOGLE_MAPS_API_KEY = 'AIzaSyBFyAFFaR0H51IsPR0oEtmsWU1TS_zmv7A'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  switch: {
    marginTop: 10,
    marginBottom: 10
  },
  mapOnSite: {
    height: '81%',
    width: '100%'
  },
  buttonContainer: {
    marginTop: 10
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  button: {
    width: 200
  }
})

const HeroOnSite = ({handleResolve, incident}) => {
  return (
    <View style={styles.container}>
      <View style={styles.switch}>
        <ToggleSwitch
          isOn={true}
          onColor="gray"
          offColor="gray"
          // label="On Duty"
          labelStyle={{color: 'black', fontWeight: '2000'}}
          size="large"
          onToggle={isOn => (isOn = true)}
        />
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        customMapStyle={RetroMapStyles}
        style={styles.mapOnSite}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: incident.lat,
          longitude: incident.lon,
          latitudeDelta: 0.025,
          longitudeDelta: 0.012
        }}
      >
        <Marker
          coordinate={{
            latitude: incident.lat,
            longitude: incident.lon
          }}
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <Button danger style={styles.button} onPress={handleResolve}>
          <Text style={styles.buttonText}>Resolve Incident</Text>
          <Icon name="ios-close-circle" />
        </Button>
      </View>
    </View>
  )
}

export default HeroOnSite
