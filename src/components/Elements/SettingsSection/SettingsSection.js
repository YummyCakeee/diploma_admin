import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

const SettingsSection = ({children, title}) => {
    return (
        <View style={styles.section}>
            <Text style={styles.title}> 
                {title}
            </Text>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 16,
        color: 'rgb(100, 100, 100)',
    }
})


export default SettingsSection;