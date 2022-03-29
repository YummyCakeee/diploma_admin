import React from 'react';
//import AppNavigation from 'components/AppNavigation/AppNavigation';
import Root from 'components/AppNavigation/AppNavigation';
import {LogBox } from 'react-native';
LogBox.ignoreLogs(['Reanimated 2']);

const App = () => {
  return (
    <Root/>
  )
}


export default App;
