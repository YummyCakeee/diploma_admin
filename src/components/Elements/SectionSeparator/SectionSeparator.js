import React from "react"
import { StyleSheet } from "react-native"
import LinearGradient from "react-native-linear-gradient"

const SectionSeparator = () => {
    return (
        <LinearGradient
            colors={[
                'rgba(255, 255, 255, 0)',
                'rgba(255, 255, 255, 1)',
                'rgba(255, 255, 255, 0)',
            ]}
            start={{ x: 0.1, y: 0.5 }}
            end={{ x: 0.9, y: 0.5 }}
            style={styles.border}
        />
    )
}

const styles = StyleSheet.create({
    border: {
        width: '100%',
        height: 2,
        opacity: 0.5,
    }
})

export default SectionSeparator