import 'react-native-gesture-handler'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
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
import OnlineChat from 'screens/onlineChatScreen/OnlineChat'
import Initialization from 'screens/initializationScreen/Initialization'
import useDrawer from './useDrawer'
import globalStyles from '../../global/styles/styles'
import { HamburgerIcon } from '../Elements/Icons/Index'

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator();

export const Screen = {
  Initialization: 'Initialization',
  Registration: 'Registration',
  Feed: 'Feed',
  Home: 'Home',
  SigningForServices: 'SigningForServices',
  ServiceRecords: 'ServiceRecords',
  OnlineChat: 'OnlineChat',
  Settings:  'Settings'
}

const Root = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
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
          component={AppNavigation}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const AppNavigation = () => {
  const {
    drawerItems,
  } = useDrawer()
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: globalStyles.drawerDark,
        unmountOnBlur: true
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
        name={Screen.OnlineChat}
        component={OnlineChat}
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
      <DrawerContentScrollView {...props}>
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
            inactiveBackgroundColor={'rgba(150, 150, 150, 0.3)'}
            focused={props.state.index === index}
          />
        ))}
      </DrawerContentScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  drawerItem: {
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

export default Root;
