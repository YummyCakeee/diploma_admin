import React from "react";
import { Text, View, StyleSheet } from "react-native";
import globalStyles from "global/styles/styles";
import OurServicesItem from "./OurServicesItem";
import useOurServices from './useOurServices'

const OurServices = () => {
    const {services} = useOurServices()
    return (
        <View style={styles.container}>
            <Text style={[globalStyles.title, { textAlign: 'center' }]}>Наши услуги: </Text>
            <View style={styles.servicesContainer}>
                {services.map(el => (
                    <OurServicesItem
                        key={el.title}
                        icon={el.icon}
                        title={el.title}
                    />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        width: '100%',
        paddingHorizontal: 20
    },
    servicesContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
})

export default OurServices