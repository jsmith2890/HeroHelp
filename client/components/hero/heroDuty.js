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

const GOOGLE_MAPS_API_KEY = 'AIzaSyBFyAFFaR0H51IsPR0oEtmsWU1TS_zmv7A'

class HeroDuty extends React.Component {
  state = {
    isOnToggleSwitch: false,
    initialLocation: null
  }

  componentDidMount() {
    this.getInitialLocation()
  }

  mapViewAdjust = (heroLat, heroLon, markerLat, markerLon) => {
    let deltaCushion = 0.005
    let midpointLat = (heroLat + markerLat) / 2
    let midpointLon = (heroLon + markerLat) / 2
    let deltaLat =
      Math.abs(Math.abs(heroLat) - Math.abs(markerLat)) + deltaCushion
    let deltaLon =
      Math.abs(Math.abs(heroLon) - Math.abs(markerLon)) + deltaCushion
    return {
      latitude: midpointLat,
      longitude: midpointLon,
      latitudeDelta: deltaLat,
      longitudeDelta: deltaLon
    }
  }

  showAlert = () => {
    let flyingOrDriving = null
    Alert.alert('Dispatch Alert!', 'You have been dispatched for duty', [
      {
        text: 'Driving Directions',
        onPress: () => (flyingOrDriving = 'driving')
      },
      {
        text: 'Flying Directions',
        onPress: () => (flyingOrDriving = 'flying')
      }
    ])
    return flyingOrDriving
  }

  getInitialLocation = async () => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      this.setState({
        locationLocation: 'Permission to access location was denied'
      })
    }
    let location = await Location.getCurrentPositionAsync({})
    console.log('location', location)
    this.setState({initialLocation: location})
  }

  handleResolve = () => {
    resolveIncident()
  }

  render() {
    let dispatchAlertReceived = false
    let flyingOrDriving = null

    if (!this.state.initialLocation) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      )
    } else {
      if (this.props.status === 'IDLE') {
        return (
          <View style={styles.container}>
            <View style={styles.switch}>
              <ToggleSwitch
                isOn={this.state.isOnToggleSwitch}
                onColor='#002239'
                //offColor="#942422"
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
              style={styles.mapIdle}
              showsUserLocation={true}
              followsUserLocation={true}
              showsMyLocationButton={true}
              showsCompass={true}
              initialRegion={{
                latitude: this.state.initialLocation.coords.latitude,
                longitude: this.state.initialLocation.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.025
              }}
            />
          </View>
        )
      } else if (this.props.status === 'ENROUTE') {
        if (!dispatchAlertReceived) {
          flyingOrDriving = this.showAlert()
          dispatchAlertReceived = true
        }
        return (
          <View style={styles.container}>
            <View style={styles.switch}>
              <ToggleSwitch
                isOn={true}
                onColor="green"
                offColor="red"
                // label="On Duty"
                labelStyle={{color: 'black', fontWeight: '2000'}}
                size="large"
                onToggle={isOn => (isOn = true)}
              />
            </View>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.mapEnroute}
              showsUserLocation={true}
              followsUserLocation={true}
              showsMyLocationButton={true}
              showsCompass={true}
              initialRegion={{
                latitude: this.state.initialLocation.coords.latitude,
                longitude: this.state.initialLocation.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.025
              }}
            >
              {flyingOrDriving === 'driving' && (
                <MapViewDirections
                  origin={{
                    latitude: this.state.initialLocation.coords.latitude,
                    longitude: this.state.initialLocation.coords.longitude
                  }}
                  destination={{
                    latitude: this.props.incident.lat,
                    longitude: this.props.incident.lon
                  }}
                  apikey={GOOGLE_MAPS_API_KEY}
                  strokeWidth={5}
                  strokeColor="hotpink"
                />
              )}
              {flyingOrDriving === 'flying' && (
                <Polyline
                  coordinates={[
                    {
                      latitude: this.state.initialLocation.coords.latitude,
                      longitude: this.state.initialLocation.coords.longitude
                    },
                    {
                      latitude: this.props.incident.lat,
                      longitude: this.props.incident.lon
                    }
                  ]}
                  strokeColor="hotpink"
                  strokeWidth={5}
                />
              )}
              <Marker
                coordinate={{
                  latitude: this.props.incident.lat,
                  longitude: this.props.incident.lon
                }}
              />
            </MapView>
          </View>
        )
      } else if (this.props.status === 'ON_SITE') {
        dispatchAlertReceived = false
        flyingOrDriving = null
        return (
          <View style={styles.container}>
            <View style={styles.switch}>
              <ToggleSwitch
                isOn={true}
                onColor="green"
                offColor="red"
                // label="On Duty"
                labelStyle={{color: 'black', fontWeight: '2000'}}
                size="large"
                onToggle={isOn => (isOn = true)}
              />
            </View>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.mapOnSite}
              showsUserLocation={true}
              followsUserLocation={true}
              showsMyLocationButton={true}
              initialRegion={{
                latitude: this.props.incident.lat,
                longitude: this.props.incident.lon,
                latitudeDelta: 0.025,
                longitudeDelta: 0.012
              }}
            >
              <Marker
                coordinate={{
                  latitude: this.props.incident.lat,
                  longitude: this.props.incident.lon
                }}
              />
            </MapView>
            <View style={styles.buttonContainer}>
              <Button danger style={styles.button} onPress={this.handleResolve}>
                <Text style={styles.buttonText}>Resolve Incident</Text>
                <Icon name="ios-close-circle" />
              </Button>
            </View>
          </View>
        )
      }
    }
  }
}

const mapStateToProps = state => ({
  hero: state.hero.hero,
  incident: state.hero.incident,
  incidents: state.hero.incidents,
  status: state.hero.status
})

export default connect(mapStateToProps)(HeroDuty)

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
  mapIdle: {
    height: '100%',
    width: '100%'
  },
  mapEnroute: {
    height: '100%',
    width: '100%'
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
  },
  alert: {
    backgroundColor: '#000',
    width: 100,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 100
  }
})
