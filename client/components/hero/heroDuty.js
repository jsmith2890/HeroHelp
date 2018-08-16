import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Container } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import ToggleSwitch from 'toggle-switch-react-native';

export default class HeroDuty extends React.Component {

  state = {
    isOnToggleSwitch: false,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.switch}>
          <ToggleSwitch
            isOn={this.state.isOnToggleSwitch}
            onColor="green"
            offColor="red"
            // label='Availibility'
            labelStyle={{ color: 'black', fontWeight: '900' }}
            size="large"
            onToggle={isOnToggleSwitch => {
              this.setState({ isOnToggleSwitch });
            }}
          />
        </View>
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
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  switch: {
    marginTop: 10,
    marginBottom: 10,
  },
  map: {
    height: '80%',
    width: '90%',
  },
});
