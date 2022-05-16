import React, { useEffect } from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import { LogoIcon } from "components/Elements/Icons/Index"
import { useNavigation } from "@react-navigation/native"
import { Screen } from "components/AppNavigation/AppNavigation"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { store } from "store"
import { updateUser } from "store/actions/userSlice"
import { axiosAPI2 } from "utils/axios"
import { ENDPOINT_USER } from "constants/endpoints"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import Toast from 'react-native-simple-toast'

const InitializationContainer = () => {

    const navigation = useNavigation()

    useEffect(()=> {
        const getUserData = async () => {

            const authToken = await AsyncStorage.getItem('authToken')
            const refreshToken = await AsyncStorage.getItem('refreshToken')
            if (authToken && refreshToken) {
                await axiosAPI2.get(ENDPOINT_USER,
                    {
                        headers: createAuthorizationHeader(authToken)
                    }).then(res => {
                        const data = res.data.data
                        const userData = {
                            authToken,
                            refreshToken,
                            name: data.first_name,
                            surname: data.second_name,
                            patronymic: data.third_name,
                            phone: data.phone,
                            email: data.email
                        }
                        store.dispatch(updateUser(userData))
                        navigation.navigate(Screen.Feed)
                    }).catch(err => {
                        Toast.show("Произошла ошибка при обращении к серверу")
                        getUserData()
                    })
            }
            else navigation.navigate(Screen.Registration)
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