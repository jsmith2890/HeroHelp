import React, { Fragment, Component } from 'react';
import {Alert} from 'react-native';
import { pushHelp } from '../../socket';
import { Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import HeroEnroute from './heroEnroute';
import HelpButton from './helpButton';
import WaitForDispatch from './waitForDispatch';
import HeroOnSite from './heroOnSite';

class CitizenHome extends Component {
  state = {
    incidentCoords: { lat: 0.0, lon: 0.0 },
  }
  //local data -- react doesn't need to know about this, decisions made
  //with this data are in render function
  initialHeroCoords = { lat: 0.0, lon: 0.0 }
  lastStatus = 'IDLE';

  pressHelpHandler = async () => {
    await Permissions.askAsync(Permissions.LOCATION);
    //assume they say yes
    let location = await Location.getCurrentPositionAsync({});
    let lat = location.coords.latitude;
    let lon = location.coords.longitude;
    this.setState({ incidentCoords: { lat, lon } });
    pushHelp({ lat, lon });
  };

  render() {
    const { status, hero } = this.props;
    const { incidentCoords } = this.state;

    //check to see if were transitioning to 'knows-hero-enroute' so
    //we can set the map view's size to be fixed so we can see
    //hero moving closer to incident
    if (status === 'KNOWS_HERO_ENROUTE' && status !== this.lastStatus) {
      this.initialHeroCoords = {lat: hero.lat, lon: hero.lon}
    }

    //if we already know hero is enroute and has been previously rendered
    //based on current and last status being 'enroute', check to see if
    //hero has crossed 60% of screen distance to incident.  If so, zoom in.
    //check both lat and lon deltas and ensure both are at least 60% to
    //deal with direct east-west or north-south movements 
    if (status=== 'KNOWS_HERO_ENROUTE' && this.lastStatus==='KNOWS_HERO_ENROUTE') {
      let deltaMapLat = Math.abs(this.initialHeroCoords.lat-incidentCoords.lat);
      let deltaMapLon = Math.abs(this.initialHeroCoords.lon-incidentCoords.lon);
      let deltaHeroLat = Math.abs(hero.lat-incidentCoords.lat);
      let deltaHeroLon = Math.abs(hero.lon-incidentCoords.lon);
      let deltaDeltaLat = deltaHeroLat/deltaMapLat;
      let deltaDeltaLon = deltaHeroLon/deltaMapLon;
      if (deltaDeltaLat<0.40 && deltaDeltaLon<0.40) { //100-60=>40%
        this.initialHeroCoords = {lat: hero.lat, lon:hero.lon}
      }
    }

    //check to see if we're transitioning out of 'hero-enroute' so
    //we can clear map rendering info
    if (status !== 'KNOWS_HERO_ENROUTE') {
      this.initialHeroCoords = { lat: 0.0, lon: 0.0 }
    }

    //check to see if we just transitioned from hero-on-site to idle, and if so,
    //advise citizen. 
    if (status === 'IDLE' && this.lastStatus==='KNOWS_HERO_ON_SITE') {
      Alert.alert(
         'Call To Action',
         'The situation has been resolved and all is well. Please press OK to continue. ',
         [
           {text: 'OK', onPress: () => console.log('OK Pressed')},
         ],
           { cancelable: false }
       )
    }

    //save new status in laststatus for next entry into this function
    this.lastStatus = status;

    //console.log(incidentCoords);
    return (
      <Fragment>
        {status === 'IDLE' && (
          <HelpButton renderAllIsWellMessage={this.renderAllIsWellMessage} pressHelpHandler={this.pressHelpHandler} />
        )}
        {status === 'WAIT_FOR_HERO_DISPATCH' && <WaitForDispatch />}
        {status === 'KNOWS_HERO_ENROUTE' && (
          <HeroEnroute hero={hero} incidentCoords={incidentCoords}  initialHeroCoords={this.initialHeroCoords} />
        )}
        {status === 'KNOWS_HERO_ON_SITE' && <HeroOnSite hero={hero} />}
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.citizen.status,
    hero: state.citizen.hero,
  };
};

//const mapDispatchToProps = dispatch => {
//};

export default connect(mapStateToProps)(CitizenHome);
