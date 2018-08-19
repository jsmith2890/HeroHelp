import React, { Fragment, Component } from 'react';
import { pushHelp } from '../../socket';
import { Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import HeroEnroute from './heroEnroute';
import HelpButton from './helpButton';
import WaitForDispatch from './waitForDispatch';
import HeroOnSite from './heroOnSite';

class CitizenHome extends Component {
  pressHelpHandler = async () => {
    await Permissions.askAsync(Permissions.LOCATION);
    //assume they say yes
    let location = await Location.getCurrentPositionAsync({});
    pushHelp({ lat: location.coords.latitude, lon: location.coords.longitude });
  };

  render() {
    const { status, hero } = this.props;
    return (
      <Fragment>
        {status === 'IDLE' && (
          <HelpButton pressHelpHandler={this.pressHelpHandler} />
        )}
        {status === 'WAIT_FOR_HERO_DISPATCH' && <WaitForDispatch />}
        {status === 'KNOWS_HERO_ENROUTE' && <HeroEnroute hero={hero} />}
        {status === 'KNOWS_HERO_ON_SITE' && <HeroOnSite />}
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

export default connect(
  mapStateToProps,
  //mapDispatchToProps,
)(CitizenHome);
