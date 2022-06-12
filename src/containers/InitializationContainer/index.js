import React, { useEffect } from "react"
import { Dimensions, NativeModules, StyleSheet, View } from "react-native"
import { LogoIcon } from "components/Elements/Icons/Index"
import { useNavigation } from "@react-navigation/native"
import { Screen } from "components/AppNavigation/AppNavigation"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { store } from "store"
import { updateUser } from "store/actions/userSlice"
import axiosAPI, { axiosAPI2 } from "utils/axios"
import { ENDPOINT_TOKENS_UPDATE, ENDPOINT_USER } from "constants/endpoints"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import Toast from 'react-native-simple-toast'
import { ORGANIZATION_ID } from "constants/application"

const InitializationContainer = () => {

    const navigation = useNavigation()
    useEffect(() => {
        const getUserData = async () => {
            let refreshToken = await AsyncStorage.getItem('refreshToken')
            if (!refreshToken)
                return navigation.navigate(Screen.Registration)
            const data = {
                refreshToken,
                org: ORGANIZATION_ID,
                fingerprint: NativeModules.PlatformConstants.Fingerprint
            }
            await axiosAPI.post(ENDPOINT_TOKENS_UPDATE, data)
                .then(async (res) => {
                    if (res.data.success) {
                        const authToken = res.data.data.auth
                        refreshToken = res.data.data.refresh
                        await AsyncStorage.setItem('authToken', authToken)
                        await AsyncStorage.setItem('refreshToken', refreshToken)
                        await axiosAPI2.get(ENDPOINT_USER,
                            {
                                headers: createAuthorizationHeader(authToken)
                            }).then(res => {
                                const data = res.data.data
                                const userData = {
                                    authToken,
                                    refreshToken,
                                    id: data.id,
                                    name: data.first_name,
                                    surname: data.second_name,
                                    patronymic: data.third_name,
                                    phone: data.phone,
                                    email: data.email,
                                    permission: data.permission
                                }
                                store.dispatch(updateUser(userData))
                                navigation.navigate(Screen.Feed)
                            }).catch(err => {
                                Toast.show("Произошла ошибка при обращении к серверу")
                                getUserData()
                            })
                    }
                    else navigation.navigate(Screen.Registration)
                }).catch(err => {
                    navigation.navigate(Screen.Registration)
                })
        }
        getUserData()
    }, [])

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