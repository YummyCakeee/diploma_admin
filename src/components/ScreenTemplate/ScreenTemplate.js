import React from "react"
import { ScrollView, StatusBar, SafeAreaView } from "react-native"
import globalStyles from "global/styles/styles"
import Header from "components/Header/Header"

const ScreenTemplate = ({ children, style, headerHamburgerIcon, scrollable = true }) => {
    return (
        <SafeAreaView style={[
            globalStyles.container,
            style,
        ]}>
            <StatusBar
                 backgroundColor="#000"
                 barStyle='light-content'
            />
            <Header {
                ...{ hamburgerIcon: headerHamburgerIcon }
            } />
            <ScrollView
                scrollEnabled={scrollable}
            >
                {children}
            </ScrollView>
        </SafeAreaView>
    )
}


export default ScreenTemplate