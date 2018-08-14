import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import LandingPage from './landingPage';
import HeroLogin from './hero/heroLogin';
import HeroSignUp from './hero/hero-signup';
import CitizenHome from './citizen/citizenHome';

export const SignedOut = createStackNavigator(
  {
    LandingPage: {
      screen: LandingPage,
      navigationOptions: {
        title: 'LandingPage',
      },
    },
    HeroLogin,
    CitizenHome
  },
  {
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const Hero = createStackNavigator({
  HeroSignUp,
});

export const createRootNavigator = (signedIn = false, type = 'user') => {
  let initialRouteName = 'SignedOut';
  if (signedIn && type === 'user') initialRouteName = 'HeroSignedIn';
  else if (signedIn) initialRouteName = 'ResidentSignedIn';

  return createSwitchNavigator(
    {
      HeroSignedIn: {
        screen: Hero,
      },
      Citizen: {
        screen: CitizenHome,
      },
      SignedOut: {
        screen: SignedOut,
      },
    },
    {
      initialRouteName,
    },
  );
};
