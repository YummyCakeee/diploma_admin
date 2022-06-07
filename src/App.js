import React from 'react';
import AppNavigation from 'components/AppNavigation/AppNavigation';
import StoreWrapper from 'store';
import { LogBox } from 'react-native';
import GlobalStylesWrapper from 'global/styles/GlobalStylesWrapper';
LogBox.ignoreLogs(['Reanimated 2']);

const App = () => {
  return (
    <StoreWrapper>
      <GlobalStylesWrapper>
        <AppNavigation />
      </GlobalStylesWrapper>
    </StoreWrapper>
  )
}


export default App;
