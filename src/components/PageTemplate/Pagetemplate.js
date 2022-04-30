import React from "react"
import { View, ScrollView } from "react-native"
import globalStyles from "../../global/styles/styles"
import Header from "../Header/Header"

const PageTemplate = ({ children, style, headerHamburgerIcon }) => {
    return (
        <View style={[
            globalStyles.container,
            style,
        ]}>
            <Header {
                ...{ hamburgerIcon: headerHamburgerIcon }
            } />
            <ScrollView>
                {children}
            </ScrollView>
        </View>
    )
}


export default PageTemplate