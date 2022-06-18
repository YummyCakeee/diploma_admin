import React, { useContext } from "react"
import { ScrollView, StatusBar, SafeAreaView, Dimensions, View, StyleSheet } from "react-native"
import Header from "components/Header/Header"
import { Color } from "global/styles/constants"
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"
import ModalController from "containers/ModalController"

const ScreenTemplate = ({ children, style, headerHamburgerIcon, scrollable = true }) => {
    const globalStyles = useContext(GlobalStylesContext)
    return (
        <>
            <StatusBar
                backgroundColor={Color.Black}
                barStyle='light-content'
            />
            <SafeAreaView style={[
                globalStyles.container,
                globalStyles.background,
                style,
            ]}>
                <Header {
                    ...{ hamburgerIcon: headerHamburgerIcon }
                } />
                <ModalController>
                    <ScrollView
                        scrollEnabled={scrollable}
                    >
                        <View>
                            {children}
                        </View>
                    </ScrollView>
                </ModalController>
            </SafeAreaView>
        </>
    )
}


export default ScreenTemplate