import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import LandingPage from './landingPage';
import HeroLogin from './hero/heroLogin';
import HeroSignUp from './hero/hero-signup';
import HeroDuty from './hero/heroDuty';
import CitizenHome from './citizen/citizenHome';

export const SignedOut = createStackNavigator({
  LandingPage: {
    screen: LandingPage,
    navigationOptions: {
      title: 'LandingPage',
    },
  },
  HeroLogin,
  HeroSignUp,
  CitizenHome,
});

const Hero = createStackNavigator({
  HeroDuty,
});

export const createRootNavigator = (signedIn = false, type = 'user') => {
  let initialRouteName = 'SignedOut';
  if (signedIn && type === 'user') initialRouteName = 'HeroSignedIn';

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
