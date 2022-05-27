import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, NativeModules } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import Home from 'screens/homeScreen/Home'
import Settings from 'screens/settingsScreen/Settings'
import SigningForServices from 'screens/signingForServicesScreen/SigningForServices'
import Registation from 'screens/registationScreen/Registation'
import ServiceRecords from 'screens/serviceRecordsScreen/ServiceRecords'
import OnlineChatRoomList from 'screens/onlineChatRoomListScreen/OnlineChatRoomList'
import Initialization from 'screens/initializationScreen/Initialization'
import useDrawer from './useDrawer'
import globalStyles from '../../global/styles/styles'
import { HamburgerIcon } from '../Elements/Icons/Index'
import { useSelector } from 'react-redux'
import { TOKEN_LIFE_TIME } from 'constants/application'
import { store } from 'store'
import { updateUser } from 'store/actions/userSlice'
import axiosAPI from 'utils/axios'
import { ENDPOINT_TOKENS_UPDATE } from 'constants/endpoints'
import { ORGANIZATION_ID } from 'constants/application'
import AsyncStorage from '@react-native-async-storage/async-storage'
import OnlineChatRoom from 'screens/onlineChatRoomScreen/OnlineChatRoom'

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator();

export const Screen = {
  Initialization: 'Initialization',
  Registration: 'Registration',
  Feed: 'Feed',
  Home: 'Home',
  SigningForServices: 'SigningForServices',
  ServiceRecords: 'ServiceRecords',
  OnlineChatRoomList: 'OnlineChatRoomList',
  OnlineChatRoom: 'OnlineChatRoom',
  Settings: 'Settings'
}

const AppNavigation = () => {

  return (
    <NavigationContainer>
      <NavigationMainContainer />
    </NavigationContainer>
  )
}

const NavigationMainContainer = () => {

  const authToken = useSelector(state => state.user.authToken)
  const refreshToken = useSelector(state => state.user.refreshToken)
  const navigation = useNavigation()

  useEffect(() => {
    const updateTimeout = setTimeout(async () => {
      if (authToken && refreshToken) {
        const data = {
          refreshToken,
          org: ORGANIZATION_ID,
          fingerprint: NativeModules.PlatformConstants.Fingerprint
        }
        await axiosAPI.post(ENDPOINT_TOKENS_UPDATE, data)
          .then(async (res) => {
            if (res.data.success) {
              const newAuthToken = res.data.data.auth
              const newRefreshToken = res.data.data.refresh
              await AsyncStorage.setItem('authToken', newAuthToken)
              await AsyncStorage.setItem('refreshToken', newRefreshToken)
              const userData = {
                authToken: newAuthToken,
                refreshToken: newRefreshToken,
              }
              store.dispatch(updateUser(userData))
            }
            else navigation.navigate(Screen.Registration)
          }).catch(err => {
            navigation.navigate(Screen.Registration)
          })
      }
    }, TOKEN_LIFE_TIME);

    return () => clearTimeout(updateTimeout)
  }, [authToken])


  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        unmountOnBlur: true
      }}
      initialRouteName={Screen.Initialization}
    >
      <Stack.Screen
        name={Screen.Initialization}
        component={Initialization}
      />
      <Stack.Screen
        name={Screen.Registration}
        component={Registation}
      />
      <Stack.Screen
        name={Screen.Feed}
        component={FeedNavigation}
      />
    </Stack.Navigator>
  )
}

const FeedNavigation = () => {
  const {
    drawerItems,
  } = useDrawer()
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: globalStyles.drawerDark,
        unmountOnBlur: true,
      }}
      initialRouteName={Screen.Home}
      drawerContent={(props) =>
        <DrawerContent
          {...{
            props,
            drawerItems,
          }}
        />
      }
    >
      <Drawer.Screen
        name={Screen.Home}
        component={Home}
      />
      <Drawer.Screen
        name={Screen.SigningForServices}
        component={SigningForServices}
      />
      <Drawer.Screen
        name={Screen.ServiceRecords}
        component={ServiceRecords}
      />
      <Drawer.Screen
        name={Screen.OnlineChatRoomList}
        component={OnlineChatRoomList}
      />
      <Drawer.Screen
        name={Screen.OnlineChatRoom}
        component={OnlineChatRoom}
      />
      <Drawer.Screen
        name={Screen.Settings}
        component={Settings}
        options={horizontalAnimation}
      />
    </Drawer.Navigator>
  );
};

const DrawerContent = ({
  props,
  drawerItems,
}) => {
  const onItemPress = ({ screen }) => {
    props.navigation.navigate(screen)
  }
  return (
    <>
      <TouchableOpacity
        style={styles.hamburgerIcon}
        activeOpacity={0.4}
        onPress={() => props.navigation.closeDrawer()}
      >
        <HamburgerIcon
          width={25}
          height={25}
          color={'rgb(30, 30, 30)'}
        />
      </TouchableOpacity>
      <DrawerContentScrollView
        {...props}
      >
        {drawerItems.map((el, index) => (
          <DrawerItem
            key={index}
            label={({ focused }) =>
              <Text style={{
                color: focused ?
                  'rgb(250, 250, 250)' :
                  'rgb(200, 200, 200)'
              }}>
                {el.label}
              </Text>
            }
            icon={el.icon}
            onPress={() => onItemPress(el)}
            style={styles.drawerItem}
            activeBackgroundColor={'rgba(120, 220, 250, 0.7)'}
            inactiveBackgroundColor={'rgba(150, 170, 180, 0.3)'}
            focused={props.state.index === index}
          />
        ))}
      </DrawerContentScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: 'rgba(50, 90, 100, 0.1)',
  },
  drawerItem: {
    borderRadius: 15,
    paddingHorizontal: 5,
  },
  hamburgerIcon: {
    marginTop: 23,
    marginLeft: 20,
    marginBottom: 15,
  },
})


const horizontalAnimation = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

export default AppNavigation;
