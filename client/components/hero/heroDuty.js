import React, { Fragment } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { resolveIncident } from '../../socket/index'
import HeroIdle from './heroIdle'
import HeroEnroute from './heroEnroute'
import HeroOnSite from './heroOnSite'
import { getGeoLocation } from '../geoLocation';

class HeroDuty extends React.Component {
  state = {
    initialLocation: null
  }

  componentDidMount() {
    this.getInitialLocation()
  }

  getInitialLocation = async () => {
    const location = await getGeoLocation()
    this.setState({ initialLocation: location })
  }

  handleResolve = () => {
    resolveIncident()
  }

  render() {
    const { status, incident, hero } = this.props
    const { initialLocation } = this.state
    if (!(initialLocation && hero.latitude)) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }
    return (
      <Fragment>
        {status === 'IDLE' && <HeroIdle initialLocation={initialLocation} heroLat={hero.latitude} heroLon={hero.longitude} />}
        {status === 'ENROUTE' && <HeroEnroute />}
        {status === 'ON_SITE' && (
          <HeroOnSite
            incident={incident}
            handleResolve={this.handleResolve}
          />
        )}
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  hero: state.hero.hero,
  incident: state.hero.incident,
  incidents: state.hero.incidents,
  status: state.hero.status
})

export default connect(mapStateToProps)(HeroDuty)
