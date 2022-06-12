import { Color } from 'global/styles/constants'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native'
import AnimatedFieldError from '../AnimatedFieldError/AnimatedFieldError'

type inputFieldProps = {
    value: string,
    onChange: (value: string) => void,
    label?: string,
    keyboardType?: 'default' | 'phone-pad' | 'decimal-pad',
    mask?: (value: string) => string,
    error: string,
    containerStyle?: StyleProp<ViewStyle>
    style?: StyleProp<ViewStyle>
}

const InputField: React.FC<inputFieldProps> =
    ({
        value = "",
        onChange = (value) => { },
        label = "",
        mask = (value) => value,
        error = '',
        containerStyle,
        style,
        ...props
    }) => {

        return (
            <View
                style={[styles.container, containerStyle]}
            >
                <View style={styles.inputField}>
                    {label.length > 0 && 
                        <Text style={styles.inputLabel}>
                            {label}
                        </Text>
                    }
                    <TextInput
                        value={value}
                        onChangeText={value => onChange(mask(value))}
                        placeholderTextColor={Color.Gray}
                        style={[
                            styles.inputText,
                            style
                        ]}
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
        marginHorizontal: 5,
    },
    inputField: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
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
        paddingVertical: 0,
        flexShrink: 2,
    },
})


export default InputField