import React from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';
import { Text, Container } from 'native-base';
import { pushHelp } from '../../socket'
import { Location, Permissions } from 'expo';
import { connect } from 'react-redux'
import CitizenMap from './citizenMap'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a4963'
  },
  button: {
    backgroundColor: '#942422',
    borderRadius: 150,
    height: 300,
    width: 300,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 100,
  }
});

class CitizenHome extends React.Component {

  pressHelpHandler = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    //assume they say yes
    let location = await Location.getCurrentPositionAsync({});
    pushHelp({ lat: location.coords.latitude, lon: location.coords.longitude });
  }

  render() {
    return (
      <CitizenMap />
      // <View>
        /* {this.props.status === 'KNOWS_HERO_ENROUTE' &&
          <CitizenMap />
        }
        {this.props.status !== 'KNOWS_HERO_ENROUTE' &&
          <Container style={styles.container}>
            <TouchableOpacity onPress={this.pressHelpHandler} style={styles.button} disabled={this.props.status !== 'IDLE'}>
              <Text style={styles.buttonText}>Help!</Text>
            </TouchableOpacity>
            {this.props.status === 'WAIT_FOR_HERO_DISPATCH' &&
              <Text>waiting for hero</Text>}
          </Container>} */
      // </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.citizen.status
  };
};

//const mapDispatchToProps = dispatch => {
//};

export default connect(
  mapStateToProps,
  //mapDispatchToProps,
)(CitizenHome);
