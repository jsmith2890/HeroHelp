import React, { Fragment, Component } from 'react';
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

    //check to see if we're transitioning out of 'hero-enroute' so
    //we can clear map rendering info -- keep a simple if statement
    //that will clear this out more than needed, but does't hurt ;-)
    if (status !== 'KNOWS_HERO_ENROUTE') {
      this.initialHeroCoords = { lat: 0.0, lon: 0.0 }
    }
    //save new status in laststatus for next entry into this function
    this.lastStatus = status;

    //console.log(incidentCoords);
    return (
      <Fragment>
        {status === 'IDLE' && (
          <HelpButton pressHelpHandler={this.pressHelpHandler} />
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
