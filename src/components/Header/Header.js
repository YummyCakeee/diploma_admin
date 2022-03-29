import React, { useRef } from "react"
import {
    View, StyleSheet, Dimensions,
    Text, TouchableOpacity,
    Animated
} from "react-native"
import { HamburgerIcon } from "../Elements/Icons/Index"
import { useNavigation } from "@react-navigation/core"

const Header = ({hamburgerIcon = true}) => {
    const navigation = useNavigation()
    const onHamburgerPress = () => {
        navigation.openDrawer()
    }
    return (
        <Animated.View style={styles.container}>
            {hamburgerIcon ?
            <TouchableOpacity
                style={styles.hamburger}
                activeOpacity={0.4}
                onPress={onHamburgerPress}
            >
                <HamburgerIcon
                    width={25}
                    height={25}
                    color={'rgb(30, 30, 30)'}
                />
            </TouchableOpacity> : null
}
            <Text style={styles.text}>Stinky Beard</Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        width: Dimensions.get('screen').width,
        alignSelf: "center",
        backgroundColor: 'rgb(50, 120, 150)',
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    hamburger: {
        position: 'absolute',
        left: 20,
    },
})

export default Header