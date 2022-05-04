import React, { useState } from "react"
import PageTemplate from "components/PageTemplate/Pagetemplate"
import globalStyles from "global/styles/styles"
import { StyleSheet, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/core"
import Authorization from "containers/Forms/Authorization"
import Registration from "containers/Forms/Registration"
export const AUTH_TYPE = 'auth_type'
export const REG_TYPE = 'reg_type'

const RegistationContainer = () => {
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
        //navigation.navigate('Feed')
    }
    const onRegSuccess = () => {
        navigation.reset({
            index: 0, 
            routes: [{name: 'Feed'}]
        })
        navigation.navigate('Feed')
    }

    return (
        <PageTemplate {...{ headerHamburgerIcon: false }}>
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
        </PageTemplate>
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