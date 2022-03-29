import React from "react";
import { View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const HomeSection = ({ children }) => {
    return (
        <View style={styles.container}>
            {children}
            <LinearGradient
                colors={[
                    'rgba(255, 255, 255, 0)',
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 0)',
                ]}
                start={{x: 0.1, y: 0.5}}
                end={{x: 0.9, y: 0.5}}
                style={styles.border}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
    },
    border: {
        width: '100%',
        height: 2,
        opacity: 0.5,
    }
})

export default HomeSection