import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import InputField from "components/Elements/InputField/InputField";
import globalStyles from "global/styles/styles";
import Button from "components/Elements/Button/Button";

const Registration = ({
    onRegSuccess = () => { },
    onToggleSignType = () => { }
}) => {
    
    const passwordFieldHeight = useRef(new Animated.Value(0)).current

    const onToggleSignTypePreCallback = () => {
        Animated.timing(passwordFieldHeight,
            {
                toValue: 0,
                duration: 400,
                easing: Easing.out(Easing.linear),
                useNativeDriver: false,
            }).start()
            setTimeout(() => onToggleSignType(), 400)
    }

    useEffect(() => {
        Animated.timing(passwordFieldHeight,
            {
                toValue: 100,
                duration: 400,
                easing: Easing.in(Easing.linear),
                useNativeDriver: false,
            }).start()
    }, [])

    return (
        <View>
            <View
                style={styles.dataSection}
            >
                <InputField
                    label="Телефон:"
                    keyboardType="phone-pad"
                    style={globalStyles.centeredElement}
                />
                <Animated.View
                    style={[
                        styles.passwordField,
                        { maxHeight: passwordFieldHeight }
                    ]}
                >
                    <InputField
                        label="Пароль:"
                        style={globalStyles.centeredElement}
                    />
                </Animated.View>
            </View>
            <Text
                style={[
                    globalStyles.text,
                    globalStyles.centeredElement,
                    { marginVertical: 10 }
                ]}
                onPress={() => onToggleSignTypePreCallback()}
            >
                Войти в существующий аккаунт
            </Text>
            <Button
                title='Регистрация'
                style={globalStyles.centeredElement}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    dataSection: {
        marginBottom: 20,
    },
    passwordField: {
        overflow: "hidden"
    }
})

export default Registration