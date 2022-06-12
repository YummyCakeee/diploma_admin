import React, { useContext } from "react"
import {
    StyleSheet,
    Text, 
    TouchableOpacity,
    Animated
} from "react-native"
import { HamburgerIcon } from "components/Elements/Icons/Index"
import { useNavigation } from "@react-navigation/core"
import { Color } from "global/styles/constants"
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"

const Header = ({hamburgerIcon = true}) => {

    const globalStyles = useContext(GlobalStylesContext)
    const navigation = useNavigation()
    const onHamburgerPress = () => {
        navigation.openDrawer()
    }
    return (
        <Animated.View 
            style={[
                styles.container,
                globalStyles.header
            ]}
        >
            {hamburgerIcon ?
            <TouchableOpacity
                style={styles.hamburger}
                activeOpacity={0.4}
                onPress={onHamburgerPress}
            >
                <HamburgerIcon
                    width={25}
                    height={25}
                    color={globalStyles.headerMenuButton?.backgroundColor}
                />
            </TouchableOpacity> : null
}
            <Text 
                style={[
                    styles.text,
                    globalStyles.headerTitle
                ]}
            >
                Stinky Beard
            </Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        width: '100%',
        alignSelf: "center",
        backgroundColor: Color.OceanBlue,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: 24,
        fontWeight: '400',
        color: '#fff',
        fontFamily: "Courgette-Regular"
    },
    hamburger: {
        position: 'absolute',
        left: 20,
    },
})

export default Header