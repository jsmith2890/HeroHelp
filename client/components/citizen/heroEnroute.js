import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';

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
  },
});

const HeroEnroute = ({ hero, incidentCoords }) => {
  const markers = [
    {
      lat: 41.89, //hero.lat
      lon: -87.64, //hero.lon
      image: require('../assets/spiderman.png'), //hero.heroImage
    },
    {
      lat: 41.934323, //incidentCoords.lat,
      lon: -87.727745, //incidentCoords.lon,
      image: require('../assets/marker.png'),
    },
  ];
  //console.log(markers);
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        initialRegion={{
          latitude: 41.89,
          longitude: -87.64,
          latitudeDelta: 0.1,
          longitudeDelta: 0.05,
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
};

export default HeroEnroute;

// <Polyline
// coordinates={[
//   { latitude: markers[0].lat, longitude: markers[0].lon },
//   { latitude: markers[1].lat, longitude: markers[1].lon},
// ]}
// />
