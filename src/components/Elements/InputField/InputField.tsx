import { Color } from 'global/styles/constants'
import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import AnimatedFieldError from '../AnimatedFieldError/AnimatedFieldError'

type inputFieldProps = {
    value: string,
    onChange: (value: string) => void,
    label?: string,
    keyboardType?: 'default' | 'phone-pad',
    mask?: (value: string) => string,
    error: string,
    style?: {},
}

const InputField: React.FC<inputFieldProps> =
    ({
        value = "",
        onChange = (value) => { },
        label = "",
        mask = (value) => value,
        error = '',
        style,
        ...props
    }) => {

        return (
            <View
                style={[styles.container, style]}
            >
                <View style={styles.inputField}>
                    <Text style={styles.inputLabel}>
                        {label}
                    </Text>
                    <TextInput style={styles.inputText}
                        value={value}
                        onChangeText={value => onChange(mask(value))}
                        placeholderTextColor={Color.Gray}
                        {...props}
                    />
                </View>
                <AnimatedFieldError
                    {...{
                        error: error,
                        ...props
                    }}
                />
            </View>
        )
    }

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginHorizontal: 5,
    },
    inputField: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: 300,
    },
    inputLabel: {
        color: '#fff',
        marginRight: 10,
        fontSize: 16,
    },
    inputText: {
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        color: '#fff',
        width: 200,
        fontSize: 16,
        paddingBottom: 0,
    },
})


export default InputField