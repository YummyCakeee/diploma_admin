import { LogoIcon } from "components/Elements/Icons/Index"
import React from "react"
import { Dimensions, StyleSheet, View } from "react-native"

const InitializationContainer = () => {

    return (
        <View
            style={styles.container}
        >
            <LogoIcon
                width={400}
                height={400}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    }
})

export default InitializationContainer