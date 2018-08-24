import React from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import RetroMapStyles from '../assets/mapStyle.json';
import { ENV_PATH } from '../../secrets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  map: {
    height: '95%',
    width: '90%',
  },
  imageMarker: {
    width: 30,
    height: 30,
    borderRadius: 17.5,
  },
});


export default class HeroEnroute extends React.Component {

  showAlert = (hero) => {
    Alert.alert(
      'Dispatch Alert!',
      `${hero.heroName} has been dispatched to your incident`
    )
  }

  componentDidMount() {
    console.log('componentDidMount:', this.props.hero)
    this.showAlert(this.props.hero)
  }

  render() {

    const { hero, incidentCoords, initialHeroCoords } = this.props;

    const markers = [
      {
        lat: hero.lat,
        lon: hero.lon,
        image: { uri: ENV_PATH + '/' + hero.heroImage },
      },
      {
        lat: incidentCoords.lat,
        lon: incidentCoords.lon,
        image: require('../assets/marker.png'),
      },
    ];

    let latitudeDelta =
      Math.abs(initialHeroCoords.lat - incidentCoords.lat) * 2 * 1.1

    let longitudeDelta =
      Math.abs(initialHeroCoords.lon - incidentCoords.lon) * 2 * 1.1

    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          customMapStyle={RetroMapStyles}
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}
          initialRegion={{
            latitude: incidentCoords.lat, //41.89,
            longitude: incidentCoords.lon, //-87.64,
            latitudeDelta,
            longitudeDelta,
          }}
          region={{
            latitude: incidentCoords.lat, //41.89,
            longitude: incidentCoords.lon, //-87.64,
            latitudeDelta,
            longitudeDelta,
          }}
        >
          {markers.map((marker, id) => (
            <Marker
              key={id}
              coordinate={{
                latitude: marker.lat, //hero.lat
                longitude: marker.lon, //hero.lon
              }}
            >
              <View>
                <Image source={marker.image} style={styles.imageMarker} />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
    );
  }
}
