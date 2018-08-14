import React, { Component } from 'react';
import { View } from 'react-native';
import { createRootNavigator } from './routes';
import { connect } from 'react-redux';
import { me } from '../store';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      isSignedIn: false,
    };
  }

  componentDidMount() {
    this.props
      .loadInitialData()
      .then(() => this.setState({ isSignedIn: true }));
  }

  render() {
    // const { isSignedIn } = this.state;
    // if (!isSignedIn) return <View />;
    const userType = this.props.user.id ? this.props.user.type : null;
    const RootNav = createRootNavigator(this.props.isLoggedIn, userType);

    return <RootNav />;
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.user.id,
    user: state.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadInitialData() {
      return dispatch(me());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
