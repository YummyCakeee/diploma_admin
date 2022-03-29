import React, { useRef, useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View, Animated, Easing } from 'react-native'

type inputFieldProps = {
    value?: string,
    onChange?: (value: string) => void,
    label?: string,
    keyboardType?: 'default' | 'phone-pad',
    mask?: (value: string) => string,
    error?: string,
    animatedError: boolean,
    style: {},
}

const InputField: React.FC<inputFieldProps> =
    ({
        value = "",
        onChange = (value) => { },
        label = "",
        mask = (value) => value,
        error,
        animatedError = true,
        style,
        ...props
    }) => {
        const errorContainerHeight = useRef(new Animated.Value(0)).current
        const [lastError, setLastError] = useState(error)
        const onChangeText = (text: string) => {
            text = mask(text)
            onChange(text)
        }

        useEffect(() => {
            if (error){
                Animated.timing(errorContainerHeight,
                    {
                        toValue: 100,
                        duration: 400,
                        easing: Easing.out(Easing.linear),
                        useNativeDriver: false,
                    }).start()
                setLastError(error)
            }
            else {
                Animated.timing(errorContainerHeight,
                    {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.out(Easing.linear),
                        useNativeDriver: false,
                    }).start()
                setTimeout(() => {
                    setLastError(error)
                }, 400);
            }
        }, [error])
        
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
                        onChangeText={onChangeText}
                        {...props}
                    />
                </View>
                <Animated.View
                    style={[styles.errorContainer, {maxHeight: errorContainerHeight}]}
                >
                    <Text
                        style={styles.errorText}
                    >{lastError}</Text>
                </Animated.View>
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
    errorContainer: {
        position: 'relative',
        overflow: 'hidden',
    },
    errorText: {
        marginTop: 3,
        color: '#FF6200',
        fontSize: 14,
    }
})


export default InputField