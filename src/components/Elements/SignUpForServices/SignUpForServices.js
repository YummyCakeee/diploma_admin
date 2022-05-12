import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Button from 'components/Elements/Button/Button'
import { useNavigation } from '@react-navigation/core'
import globalStyles from 'global/styles/styles'
import { Screen } from 'components/AppNavigation/AppNavigation'

const SignUpForServices = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <View
                style={styles.button}
            >
                <Button
                    title="Записаться"
                    onPress={() => navigation.navigate(Screen.SigningForServices)}
                />
            </View>
            <Text
                style={[globalStyles.text, styles.text]}
            >
                Запишитесь на приём к мастеру в одно касание!
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },  
    button: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center',
    },
    text: {
        alignSelf: 'center',
        marginTop: 5,
    }
})

export default SignUpForServices