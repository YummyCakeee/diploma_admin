import React from "react"
import { ScrollView, StatusBar, SafeAreaView, Dimensions, View, StyleSheet } from "react-native"
import globalStyles from "global/styles/styles"
import Header from "components/Header/Header"
import { Color } from "global/styles/constants"

const ScreenTemplate = ({ children, style, headerHamburgerIcon, scrollable = true }) => {
    return (
        <SafeAreaView style={[
            globalStyles.container,
            style,
        ]}>
            <StatusBar
                 backgroundColor={Color.Black}
                 barStyle='light-content'
            />
            <Header {
                ...{ hamburgerIcon: headerHamburgerIcon }
            } />
            <ScrollView
                scrollEnabled={scrollable}
            >
                <View
                    style={styles.childrenContainer}
                >
                {children}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    childrenContainer: {
        minHeight: Dimensions.get('window').height - 70
    }
})

export default ScreenTemplate