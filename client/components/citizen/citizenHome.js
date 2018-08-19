import React, { Fragment, Component } from 'react';
import { pushHelp } from '../../socket';
import { Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import HeroEnroute from './heroEnroute';
import HelpButton from './helpButton';
import WaitForDispatch from './waitForDispatch';
import HeroOnSite from './heroOnSite';

class CitizenHome extends Component {
  state = { incidentCoords: { lat: '', lon: '' } };

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
    //console.log(incidentCoords);
    return (
      <Fragment>
        {status === 'IDLE' && (
          <HelpButton pressHelpHandler={this.pressHelpHandler} />
        )}
        {status === 'WAIT_FOR_HERO_DISPATCH' && <WaitForDispatch />}
        {status === 'KNOWS_HERO_ENROUTE' && (
          <HeroEnroute hero={hero} incidentCoords={incidentCoords} />
        )}
        {status === 'KNOWS_HERO_ON_SITE' && <HeroOnSite hero={hero} />}
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: 'KNOWS_HERO_ENROUTE', //state.citizen.status,
    hero: state.citizen.hero,
  };
};

//const mapDispatchToProps = dispatch => {
//};

export default connect(mapStateToProps)(CitizenHome);
