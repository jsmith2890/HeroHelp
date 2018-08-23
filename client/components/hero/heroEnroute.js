import React from 'react'
import { StyleSheet, View, Image, Text, Alert } from 'react-native'
import { connect } from 'react-redux'
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { heroEnrouteResponse } from '../../store/heroes'
import RetroMapStyles from '../assets/mapStyle.json'
import { startMotion } from '../geoLocation'

const GOOGLE_MAPS_API_KEY = 'AIzaSyBFyAFFaR0H51IsPR0oEtmsWU1TS_zmv7A'




class HeroEnroute extends React.Component {
  // mapViewAdjust = (heroLat, heroLon, markerLat, markerLon) => {
  //   let deltaCushion = 0.005
  //   let midpointLat = (heroLat + markerLat) / 2
  //   let midpointLon = (heroLon + markerLat) / 2
  //   let deltaLat =
  //     Math.abs(Math.abs(heroLat) - Math.abs(markerLat)) + deltaCushion
  //   let deltaLon =
  //     Math.abs(Math.abs(heroLon) - Math.abs(markerLon)) + deltaCushion
  //   return {
  //     latitude: midpointLat,
  //     longitude: midpointLon,
  //     latitudeDelta: deltaLat,
  //     longitudeDelta: deltaLon
  //   }
  // }

  showAlert = (incident) => {
    Alert.alert(
      'Dispatch Alert!',
      'You have been dispatched for duty. Please choose your mode of transportation',
      [
        {
          text: 'Driving',
          onPress: () => this.props.heroResponse('driving', incident)
        },
        {
          text: 'Flying',
          onPress: () => this.props.heroResponse('flying', incident)
        }
      ]
    )
  }

  componentDidMount() {
    this.showAlert(this.props.incident)
    // let modeOfTrans = this.showAlert()
    // this.props.heroResponse(modeOfTrans)
  }

  render() {
    const { hero, incident } = this.props

    const markers = [
       {
         lat: incident.lat,
         lon: incident.lon,
         image: require('../assets/marker.png'),
         style: styles.imageMarkerIncident
       },
      {
        lat: hero.latitude,
        lon: hero.longitude,
        image: require('../assets/geolocation.png'),
        style: styles.imageMarkerHero
      },
    ];

    //set minimum span to match HeroOnSite:
    let latitudeDelta =
      Math.abs(hero.latitude - incident.lat) * 2 * 1.1
    if (latitudeDelta < 0.02) latitudeDelta = 0.02

    let longitudeDelta =
      Math.abs(hero.longitude - incident.lon) * 2 * 1.1
    if (longitudeDelta < 0.01) longitudeDelta = 0.01;

    return (
      <View style={styles.container}>
        <View style={styles.message}>
          <Text style={styles.messageText}>Dispatched - proceed to incident site</Text>
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
            // latitude: hero.latitude,
            // longitude: hero.longitude,
            latitude: (hero.latitude + incident.lat) / 2,
            longitude: (hero.longitude + incident.lon) / 2,
            latitudeDelta,
            longitudeDelta,
          }}
          region={{
            latitude: (hero.latitude + incident.lat) / 2,
            longitude: (hero.longitude + incident.lon) / 2,
            latitudeDelta,
            longitudeDelta,
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
              strokeColor='#942422'
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
              strokeColor='#942422'
              strokeWidth={5}
            />
          )}
         {markers.map((marker, id) => (
          <Marker
            key={id}
            coordinate={{
              latitude: marker.lat, //hero.lat
              longitude: marker.lon, //hero.lon
            }}
          >
            <View>
              <Image source={marker.image} style={marker.style} />
            </View>
          </Marker>
        ))}

          {/* <Marker
            coordinate={{
              latitude: incident.lat,
              longitude: incident.lon
            }}
          /> */}
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
  heroResponse: (flyingOrDriving, incident) => {
    console.log('incident is: ',incident);
    startMotion(incident.lat, incident.lon)
    dispatch(heroEnrouteResponse(flyingOrDriving))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(HeroEnroute)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  message: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  messageText: {
    color: '#002239',
    fontWeight: 'bold',
    fontSize: 20,
  },
  mapEnroute: {
    height: '91.5%',
    width: '100%'
  },
  imageMarkerHero: {
     width: 20,
     height: 20,
     borderRadius: 17.5,
   },
  imageMarkerIncident: {
    width: 40,
    height: 40,
    borderRadius: 27.5,
  },
})
