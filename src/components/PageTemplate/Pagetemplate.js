import React from "react"
import { View } from "react-native"
import globalStyles from "../../global/styles/styles"
import Header from "../Header/Header"

const PageTemplate = ({children, style, headerHamburgerIcon}) => {
    return (
    <View style={[
        globalStyles.container,
        style, 
        ]}>
        <Header {
            ...{hamburgerIcon: headerHamburgerIcon}
            }/>
        {children}
    </View>
    )
}


export default PageTemplate