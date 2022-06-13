import React, { useContext } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Button from 'components/Elements/Button/Button'
import { useNavigation } from '@react-navigation/core'
import { Screen } from 'components/AppNavigation/AppNavigation'
import { GlobalStylesContext } from 'global/styles/GlobalStylesWrapper'

const SignUpForServices = () => {
    const navigation = useNavigation()
    const globalStyles = useContext(GlobalStylesContext)
    
    return (
        <View style={styles.container}>
            <View
                style={styles.button}
            >
                <Button
                    primary
                    title="Записаться"
                    onPress={() => navigation.navigate(Screen.SigningForServices)}
                />
            </View>
            <Text
                style={[globalStyles.text, styles.text]}
            >
                Запишитесь на приём к мастеру в несколько касаний!
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
        textAlign: 'center'
    }
})

export default SignUpForServices