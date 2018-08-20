import React from 'react'
import {StyleSheet, View, Text, Alert} from 'react-native'
import {connect} from 'react-redux'
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import {heroEnrouteResponse} from '../../store/heroes'
import RetroMapStyles from '../assets/mapStyle.json'

class HeroEnroute extends React.Component {
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
    Alert.alert(
      'Dispatch Alert!',
      'You have been dispatched for duty. Please choose your mode of transportation',
      [
        {
          text: 'Driving',
          onPress: () => this.props.heroResponse('driving')
        },
        {
          text: 'Flying',
          onPress: () => this.props.heroResponse('flying')
        }
      ]
    )
  }

  componentDidMount() {
    this.showAlert()
    // let modeOfTrans = this.showAlert()
    // this.props.heroResponse(modeOfTrans)
  }

  render() {
    const {hero, incident} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.message}>
        <Text style={styles.messageText}>Message</Text>
        </View>
        <MapView
          provider={PROVIDER_GOOGLE}
          customMapStyle={RetroMapStyles}
          style={styles.mapEnroute}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          initialRegion={{
            latitude: hero.latitude,
            longitude: hero.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.025
          }}
          region={{
            latitude: (hero.latitude + incident.lat) / 2,
            longitude: (hero.longitude + incident.lon) / 2,
            latitudeDelta:
              Math.abs(Math.abs(hero.latitude) - Math.abs(incident.lat)) * 1.1,
            longitudeDelta:
              Math.abs(Math.abs(hero.longitude) - Math.abs(incident.lon)) * 1.1
          }}
        >
          {this.props.flyingOrDriving === 'driving' && (
            <MapViewDirections
              origin={{
                latitude: hero.latitude,
                longitude: hero.longitude
              }}
              destination={{
                latitude: incident.lat,
                longitude: incident.lon
              }}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={5}
              strokeColor="hotpink"
            />
          )}
          {this.props.flyingOrDriving === 'flying' && (
            <Polyline
              coordinates={[
                {
                  latitude: hero.latitude,
                  longitude: hero.longitude
                },
                {
                  latitude: incident.lat,
                  longitude: incident.lon
                }
              ]}
              strokeColor="hotpink"
              strokeWidth={5}
            />
          )}
          <Marker
            coordinate={{
              latitude: incident.lat,
              longitude: incident.lon
            }}
          />
        </MapView>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  hero: state.hero.hero,
  incident: state.hero.incident,
  flyingOrDriving: state.hero.enroute.flyingOrDriving
})

const mapDispatchToProps = dispatch => ({
  heroResponse: flyingOrDriving =>
    dispatch(heroEnrouteResponse(flyingOrDriving))
})

export default connect(mapStateToProps, mapDispatchToProps)(HeroEnroute)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  message: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  messageText:{
    color: '#000'
  },
  mapEnroute: {
    height: '100%',
    width: '100%'
  }
})
