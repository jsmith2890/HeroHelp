import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import RetroMapStyles from '../assets/mapStyle.json';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBFyAFFaR0H51IsPR0oEtmsWU1TS_zmv7A';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  mapOnSite: {
    height: '90.5%',
    width: '100%',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
  },
});

const HeroOnSite = ({ handleResolve, incident }) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button block danger style={styles.button} onPress={handleResolve}>
          <Icon name="ios-close-circle" />
          <Text style={styles.buttonText}>Resolve Incident</Text>
        </Button>
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
          latitudeDelta: 0.020,
          longitudeDelta: 0.010,
        }}
      >
        <Marker
          coordinate={{
            latitude: incident.lat,
            longitude: incident.lon,
          }}
        />
      </MapView>
    </View>
  );
};

export default HeroOnSite;
