import React, { useContext, useState } from "react"
import ScreenTemplate from "components/ScreenTemplate/ScreenTemplate"
import { StyleSheet, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/core"
import Authorization from "containers/Forms/Authorization"
import { Screen } from "components/AppNavigation/AppNavigation"
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"

const RegistationContainer = () => {

    const navigation = useNavigation()
    const globalStyles = useContext(GlobalStylesContext)

    const onAuthSuccess = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: Screen.Feed }]
        })
    }

    return (
        <>
            <Text
                style={[globalStyles.pageTitle, styles.mainTitle]}
            >
                Войдите в аккаунт
            </Text>
            <View
                style={styles.mainContainer}
            >
                <Text
                    style={[
                        globalStyles.text,
                        globalStyles.centeredElement,
                        styles.signTypeText
                    ]}
                >
                    Вход в аккаунт
                </Text>
                <Authorization
                    onAuthSuccess={onAuthSuccess}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    mainTitle: {
        textAlign: "center",
        marginTop: 70,
        position: "absolute"
    },
    mainContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
    },
    signTypeText: {
        color: 'rgb(100, 100, 100)',
        fontSize: 20,
        marginBottom: 40,
    },
})

export default RegistationContainer