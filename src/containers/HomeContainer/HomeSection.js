import React from "react";
import { View, StyleSheet } from "react-native";
import SectionSeparator from "components/Elements/SectionSeparator/SectionSeparator";

const HomeSection = ({ children }) => {
    return (
        <View style={styles.container}>
            {children}
            <SectionSeparator/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
    },
})

export default HomeSection