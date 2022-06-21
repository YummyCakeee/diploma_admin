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
            <ModalController>
                <SafeAreaView style={[
                    globalStyles.container,
                    globalStyles.background,
                    style,
                ]}>
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
            </ModalController>
        </>
    )
}

const styles = StyleSheet.create({
    childrenContainer: {
        minHeight: Dimensions.get('window').height - 70
    }
})


export default ScreenTemplate