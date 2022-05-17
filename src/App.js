import React from 'react';
import AppNavigation from 'components/AppNavigation/AppNavigation';
import StoreWrapper from 'store';
import {LogBox } from 'react-native';
LogBox.ignoreLogs(['Reanimated 2']);

const App = () => {
  return (
    <StoreWrapper>
      <AppNavigation />
    </StoreWrapper>
  )
}


export default App;
