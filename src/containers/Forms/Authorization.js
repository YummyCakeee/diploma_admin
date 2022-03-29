import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing, Alert } from "react-native";
import globalStyles from "global/styles/styles";
import Button from "components/Elements/Button/Button";
import { phoneNumberMask } from "utils/textMasking";
import { passwordValidator, phoneNumberValidator } from "utils/validators";
import { Formik, Field } from "formik";
import FormFieldInput from "containers/Forms/FormFieldInput";
import CodeInputField from "components/Elements/CodeInputField/CodeInputField";
import axiosAPI from "utils/axios";
import { ENDPOINT_MAIN_AUTH } from "constants/endpoints";


const Authorization = ({
    onAuthSuccess = () => { },
    onToggleSignType = () => { }
}) => {
    const [code, setCode] = useState("")
    const [stage, setStage] = useState(0)
    const [usePassword, setUsePassword] = useState(false)
    const passwordFieldHeight = useRef(new Animated.Value(0)).current
    const usePasswordTextHeight = useRef(new Animated.Value(0)).current
    const buttonTitles = new Map([
        [0, 'Далее'],
        [1, 'Отправить'],
        [2, 'Войти']
    ])

    const asyncSetUsePassword = () => 
        new Promise((resolve) => setUsePassword(!usePassword, resolve))

    useEffect(() => {
        Animated.timing(usePasswordTextHeight,
            {
                toValue: 100,
                duration: 400,
                easing: Easing.out(Easing.linear),
                useNativeDriver: false,
            }).start()
    }, [])

    const onSubmit = (values) => {
        const formData = new FormData()
        if (stage === 0) {
            formData.append('action', 'authorization')
            formData.append('phone', values.phone)
            if (usePassword)
                formData.append('password', values.password)
                return axiosAPI.post(ENDPOINT_MAIN_AUTH, formData)
                .then(res => {
                    if (res.data?.success && usePassword)
                        setStage(2)
                    else setStage(1)
                })
                .catch(() => {
                    Alert.alert('Ошибка', 'Не удалось отправить форму')
                })
        }


        //onAuthSuccess()
    }

    const onToggleSignTypePreCallback = () => {
        Animated.timing(passwordFieldHeight,
            {
                toValue: 0,
                duration: 400,
                easing: Easing.out(Easing.linear),
                useNativeDriver: false,
            }).start()
        Animated.timing(usePasswordTextHeight,
            {
                toValue: 0,
                duration: 400,
                easing: Easing.out(Easing.linear),
                useNativeDriver: false,
            }).start()
        setTimeout(() => onToggleSignType(), 400)
    }

    const onUsePasswordPress = () => {
        if (!usePassword) {
            Animated.timing(passwordFieldHeight,
                {
                    toValue: 100,
                    duration: 300,
                    easing: Easing.in(Easing.linear),
                    useNativeDriver: false,
                }).start()
        }
        else {
            Animated.timing(passwordFieldHeight,
                {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.linear),
                    useNativeDriver: false,
                }).start()
        }
        setUsePassword(!usePassword)
    }

    return (
        <View>
            <Formik
                validateOnMount
                initialValues={{
                    phone: '+7 ',
                    password: ''
                }}
                onSubmit={onSubmit}
            >
                {({ handleSubmit, isValid, values, setFieldError }) => (
                    <View>
                        <View
                            style={styles.dataSection}
                        >
                            {stage === 0 && (
                                <>
                                    <Field
                                        name="phone"
                                        label="Телефон:"
                                        component={FormFieldInput}
                                        mask={phoneNumberMask}
                                        validate={phoneNumberValidator}
                                    />
                                    <Animated.View
                                        style={[
                                            styles.passwordField,
                                            { maxHeight: passwordFieldHeight }
                                        ]}
                                    >
                                        <Field
                                            name="password"
                                            label="Пароль:"
                                            component={FormFieldInput}
                                            validate={(value) =>
                                                usePassword ?
                                                    passwordValidator(value) :
                                                    undefined 
                                            }
                                            secureTextEntry
                                        />
                                    </Animated.View>
                                </>
                            )}
                            {stage === 1 && !usePassword && (
                                <>
                                    <Text
                                        style={[
                                            globalStyles.text, 
                                            globalStyles.centeredElement,
                                            styles.enterCodeText
                                        ]}
                                    >
                                        Введите код, отправленный{'\n'}
                                        в СМС на номер{'\n'}
                                        <Text
                                            style={styles.enterCodeTextPhone}
                                        >
                                            {values.phone}
                                        </Text>, ниже:
                                    </Text>
                                    <Field
                                        name="sms_code"
                                        component={CodeInputField}
                                        secureTextEntry
                                        value={code}
                                        onChange={setCode}
                                        style={globalStyles.centeredElement}
                                    />
                                </>
                            )}
                        </View>
                        {stage === 0 && (
                            <>
                                <Animated.View
                                    style={{
                                        maxHeight: usePasswordTextHeight,
                                        overflow: "hidden"
                                    }}
                                >
                                    <Text
                                        style={[
                                            globalStyles.text,
                                            globalStyles.centeredElement,
                                            styles.usePasswordText,
                                        ]}
                                        onPress={() => {
                                            if (usePassword) setFieldError('password', undefined)
                                            else setFieldError('password', passwordValidator(values.password))
                                            onUsePasswordPress()
                                        }}
                                    >
                                        {usePassword ?
                                            'Войти по коду из СМС' :
                                            'Войти по паролю'
                                        }
                                    </Text>
                                </Animated.View>
                                <Text
                                    style={[
                                        globalStyles.text,
                                        globalStyles.centeredElement,
                                        { marginVertical: 10 }
                                    ]}
                                    onPress={() => onToggleSignTypePreCallback()}
                                >
                                    Нет аккаунта? Зарегистрируйтесь
                                </Text>
                            </>
                        )}
                        <Button
                            title={buttonTitles.get(stage)}
                            style={globalStyles.centeredElement}
                            onPress={handleSubmit}
                            disabled={!isValid}
                        />
                    </View>
                )}
            </Formik>
        </View>
    )
}

const styles = StyleSheet.create({
    dataSection: {
        marginBottom: 20,
    },
    usePasswordText: {
        marginBottom: 20,
    },
    passwordField: {
        overflow: "hidden"
    },
    errorContainer: {

    },
    errorText: {
        color: '#FF6200',
        fontSize: 14,
    },
    enterCodeText: {
        textAlign: 'center',
        marginBottom: 10,
    },
    enterCodeTextPhone: {
        color: '#1B70E0'
    }
})

export default Authorization