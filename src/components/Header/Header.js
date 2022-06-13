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
import { GlobalContentContext } from "global/content/GlobalContentWrapper"

const Header = ({hamburgerIcon = true}) => {

    const globalStyles = useContext(GlobalStylesContext)
    const globalContent = useContext(GlobalContentContext)
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
                style={globalStyles.headerTitle}
            >
                {globalContent.headerTitle.text}
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
    hamburger: {
        position: 'absolute',
        left: 20,
    },
})

export default Header