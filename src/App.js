import React from 'react';
import AppNavigation from 'components/AppNavigation/AppNavigation';
import StoreWrapper from 'store';
import { LogBox } from 'react-native';
import GlobalStylesWrapper from 'global/styles/GlobalStylesWrapper';
import GlobalContentWrapper from 'global/content/GlobalContentWrapper';
LogBox.ignoreLogs(['Reanimated 2']);

const App = () => {
  return (
    <StoreWrapper>
      <GlobalStylesWrapper>
        <GlobalContentWrapper>
          <AppNavigation />
        </GlobalContentWrapper>
      </GlobalStylesWrapper>
    </StoreWrapper>
  )
}


export default App;
