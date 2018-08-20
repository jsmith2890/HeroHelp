import React, {Fragment} from 'react'
import {StyleSheet, View, Text, Alert, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {Container, Header, Content, Button, Icon} from 'native-base'
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps'
import ToggleSwitch from 'toggle-switch-react-native'
import {Constants, Location, Permissions} from 'expo'
import {resolveIncident} from '../../socket/index'
import MapViewDirections from 'react-native-maps-directions'
import HeroIdle from './heroIdle'
import HeroEnroute from './heroEnroute'
import HeroOnSite from './heroOnSite'

const GOOGLE_MAPS_API_KEY = 'AIzaSyBFyAFFaR0H51IsPR0oEtmsWU1TS_zmv7A'

class HeroDuty1 extends React.Component {
  state = {
    isOnToggleSwitch: false,
    initialLocation: null
  }

  componentDidMount() {
    this.getInitialLocation()
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
    const {status, incident} = this.props
    const {initialLocation} = this.state
    if (!initialLocation) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }
    return (
      <Fragment>
        {status === 'IDLE' && <HeroIdle initialLocation={initialLocation} />}
        {status === 'ENROUTE' && <HeroEnroute />}
        {status === 'ON_SITE' && (
          <HeroOnSite
            incident={incident}
            hero={hero}
            handleResult={this.handleResolve}
          />
        )}
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  hero: state.hero.hero,
  incident: state.hero.incident,
  incidents: state.hero.incidents,
  status: state.hero.status
})

export default connect(mapStateToProps)(HeroDuty1)

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
