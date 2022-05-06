import React, { useEffect, useState } from "react"
import ScreenTemplate from "components/ScreenTemplate/ScreenTemplate"
import globalStyles from "global/styles/styles"
import { StyleSheet, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/core"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Authorization from "containers/Forms/Authorization"
import Registration from "containers/Forms/Registration"
import { updateUser } from "store/actions/userSlice"
import { store } from "store"
export const AUTH_TYPE = 'auth_type'
export const REG_TYPE = 'reg_type'

const RegistationContainer = () => {
    useEffect(()=> {
        const getTokens = async () => {

            const authToken = await AsyncStorage.getItem('authToken')
            const refreshToken = await AsyncStorage.getItem('refreshToken')
            if (authToken && refreshToken) {
                const userData = {
                    authToken,
                    refreshToken
                }
                store.dispatch(updateUser(userData))
                onAuthSuccess()
            }
        }
        getTokens()
    }, [])

    const [signType, setSignType] = useState(AUTH_TYPE)
    const navigation = useNavigation()

    const onToggleSignType = () => {
        signType === AUTH_TYPE ?
            setSignType(REG_TYPE) :
            setSignType(AUTH_TYPE)
    }

    const onAuthSuccess = () => {
        navigation.reset({
            index: 0, 
            routes: [{name: 'Feed'}]
        })
    }
    const onRegSuccess = () => {
        navigation.reset({
            index: 0, 
            routes: [{name: 'Feed'}]
        })
    }

    return (
        <ScreenTemplate {...{ headerHamburgerIcon: false }}>
            <Text
                style={[globalStyles.page_title, styles.mainTitle]}
            >
                Войдите{' '}
                или{'\n'}
                зарегистрируйтесь
            </Text>
            <View
                style={styles.mainContainer}
            >
                <View
                    style={styles.contentContainer}
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
            </View>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    mainTitle: {
        textAlign: "center",
        marginTop: 70
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