import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import ToggleSwitch from 'toggle-switch-react-native';
import { isAvailable } from '../../socket';
import RetroMapStyles from '../assets/mapStyle.json';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  switch: {
    marginTop: 10,
    marginBottom: 10,
  },
  mapIdle: {
    height: '91.5%',
    width: '100%',
  },
  imageMarker: {
    width: 20,
    height: 20,
    borderRadius: 17.5,
  },
});

export default class HeroIdle extends Component {
  state = {
    isOnToggleSwitch: false,
  };
  render() {

    const { initialLocation, heroLat, heroLon } = this.props
    const markers = [
      // {
      //   lat: hero.lat,
      //   lon: hero.lon,
      //   image: { uri: ENV_PATH + '/' + hero.heroImage },
      // },
      {
        lat: heroLat,
        lon: heroLon,
        image: require('../assets/geolocation.png'),
      },
    ];
    return (
      <View style={styles.container}>
        <View style={styles.switch}>
          <ToggleSwitch
            isOn={this.state.isOnToggleSwitch}
            onColor="#002239"
            offColor="#848587"
            // label={'Duty Status'}
            labelStyle={{ color: 'black', fontWeight: '900' }}
            size="large"
            onToggle={isOnToggleSwitch => {

              isAvailable(isOnToggleSwitch);
              this.setState({ isOnToggleSwitch });

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
            latitudeDelta: 0.1,
            longitudeDelta: 0.1

          }}
          region={{
            latitude: heroLat,
            longitude: heroLon,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
          }}
        >
          <Marker
            coordinate={{
              latitude: markers[0].lat, //hero.lat
              longitude: markers[0].lon, //hero.lon
            }}
          >
            <View>
              <Image source={markers[0].image} style={styles.imageMarker} />
            </View>
          </Marker>
        </MapView>
      </View>
    );
  }
}
