import React from "react";
import { Text, View, StyleSheet } from "react-native";

const OurServicesItem = ({ title = "Услуга", icon }) => {
    return (
        <View style={styles.container}>
            <View style={styles.serviceIcon}>
                {icon}
            </View>
            <Text style={styles.serviceText}>
                {title}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        width: 120,
        height: 100,
        padding: 5,
    },
    serviceIcon: {
        marginBottom: 5,
    },
    serviceText: {
        color: "#fff",
        textAlign: 'center'
    },
})

export default OurServicesItem