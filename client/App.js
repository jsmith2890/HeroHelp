import React from 'react';
import { Provider } from 'react-redux';
import store from './store/';
import  Main  from './components/main';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}
