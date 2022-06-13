import React, { useContext, useState } from "react"
import ScreenTemplate from "components/ScreenTemplate/ScreenTemplate"
import { StyleSheet, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/core"
import Authorization from "containers/Forms/Authorization"
import Registration from "containers/Forms/Registration"
import { Screen } from "components/AppNavigation/AppNavigation"
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"
export const AUTH_TYPE = 'auth_type'
export const REG_TYPE = 'reg_type'

const RegistationContainer = () => {

    const [signType, setSignType] = useState(AUTH_TYPE)
    const navigation = useNavigation()
    const globalStyles = useContext(GlobalStylesContext)

    const onToggleSignType = () => {
        signType === AUTH_TYPE ?
            setSignType(REG_TYPE) :
            setSignType(AUTH_TYPE)
    }

    const onAuthSuccess = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: Screen.Feed }]
        })
    }
    const onRegSuccess = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: Screen.Feed }]
        })
    }

    return (
        <ScreenTemplate {...{ headerHamburgerIcon: false }}>
            <Text
                style={[globalStyles.pageTitle, styles.mainTitle]}
            >
                Войдите{' '}
                или{'\n'}
                зарегистрируйтесь
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
                    {signType === AUTH_TYPE ?
                        'Вход в аккаунт' :
                        'Регистрация'
                    }
                </Text>
                {signType === AUTH_TYPE ?
                    <Authorization
                        onAuthSuccess={onAuthSuccess}
                        onToggleSignType={onToggleSignType} /> :
                    <Registration
                        onRegSuccess={onRegSuccess}
                        onToggleSignType={onToggleSignType} />
                }
            </View>
        </ScreenTemplate>
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