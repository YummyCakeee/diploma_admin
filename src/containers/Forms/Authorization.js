import React, { useState, useRef, useEffect } from "react";
import { 
    View, Text, StyleSheet, 
    Animated, Easing, NativeModules 
} from "react-native";
import Toast from 'react-native-simple-toast'
import globalStyles from "global/styles/styles";
import Button from "components/Elements/Button/Button";
import { 
    phoneNumberFormatter, 
    simplePhoneNumberFormatter
} from "utils/formatters";
import {
    passwordValidator,
    phoneNumberValidator,
    smsCodeValidator
} from "utils/validators";
import { Formik, Field } from "formik";
import FormFieldInput from "containers/Forms/FormFieldInput";
import FormCodeFieldInput from "containers/Forms/FormCodeFieldInput";
import axiosAPI from "utils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINT_MAIN_AUTH } from "constants/endpoints";
import { ORGANIZATION_ID, USER_TYPE } from "constants/application";
import { useDispatch } from "react-redux";
import { updateUser } from "store/actions/userSlice";


const Authorization = ({
    onAuthSuccess = () => { },
    onToggleSignType = () => { }
}) => {
    const [stage, setStage] = useState(0)
    const [usePassword, setUsePassword] = useState(false)
    const passwordFieldHeight = useRef(new Animated.Value(0)).current
    const usePasswordTextHeight = useRef(new Animated.Value(0)).current
    const [sendCodeRemainingTime, setSendCodeRemainingTime] = useState(90)
    const dispatch = useDispatch()

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
        if (stage === 0) {
            let data = {
                org: ORGANIZATION_ID,
                phone: simplePhoneNumberFormatter(values.phone),
                userType: USER_TYPE,
                fingerprint: NativeModules.PlatformConstants.Fingerprint,
            }
            if (usePassword) {
                data.action = 'password'
                data.password = values.password

                return axiosAPI.post(ENDPOINT_MAIN_AUTH, data)
                    .then(res => {
                        if (res.data?.success) {
                            const userData = {
                                authToken: res.data.data.auth,
                                refreshToken: res.data.data.refresh
                            }
                            dispatch(updateUser(userData))
                            onAuthSuccess()
                        }
                        else {
                            Toast.show(`Ошибка: ${res.data.message}`)
                        }
                    })
                    .catch(error => {
                        Toast.show('Ошибка: Не удалось отправить форму')
                    })
            }

            data.action = 'request'
            return axiosAPI.post(ENDPOINT_MAIN_AUTH, data)
                .then(res => {
                    if (res.data?.success) {
                        setSendCodeRemainingTime(res.data.data.remainingTime)
                        setStage(1)
                    } else if (!res.data?.success) {
                        Toast.show(`Ошибка: ${res.data.message}`)
                    }
                })
                .catch(error => {
                    console.log(error.response.data)
                    Toast.show('Ошибка: Не удалось отправить форму')
                })
        }
        if (stage === 1) {
            let data = {
                action: 'confirm',
                org: ORGANIZATION_ID,
                phone: simplePhoneNumberFormatter(values.phone),
                code: Number(values.code),
                userType: USER_TYPE,
                fingerprint: NativeModules.PlatformConstants.Fingerprint,
            }
            return axiosAPI.post(ENDPOINT_MAIN_AUTH, data)
                .then(res => {
                    if (res.data?.success) {
                        const userData = {
                            authToken: res.data.data.auth,
                            refreshToken: res.data.data.refresh
                        }
                        dispatch(updateUser(userData))
                        AsyncStorage.setItem('authToken', userData.authToken)
                        AsyncStorage.setItem('refreshToken', userData.refreshToken)
                        onAuthSuccess()
                    } else if (!res.data?.success) {
                        Toast.show(`Ошибка: ${res.data.message}`)
                    }
                })
                .catch(error => {
                    Toast.show('Ошибка: Не удалось отправить форму')
                })
        }
    }

    const onCodeResendRequest = async (phone) => {
        const data = {
            action: "request",
            org: ORGANIZATION_ID,
            phone: simplePhoneNumberFormatter(phone),
            userType: USER_TYPE,
            fingerprint: NativeModules.PlatformConstants.Fingerprint
        }
        await axiosAPI.post(ENDPOINT_MAIN_AUTH, data)
            .then(res => {
                if (res.data?.success) {
                    setSendCodeRemainingTime(res.data.data.remainingTime)
                } else if (!res.data?.success) {
                    Toast.show(`Ошибка: ${res.data.message}`)
                }
            })
            .catch(error => {
                Toast.show('Ошибка: Произошла ошибка при отправке.')
            })
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
                                        mask={phoneNumberFormatter}
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
                                        name="code"
                                        component={FormCodeFieldInput}
                                        validate={smsCodeValidator}
                                        startRemainingTime={sendCodeRemainingTime}
                                        onCodeResendRequest={() => onCodeResendRequest(values.phone)}
                                    />
                                </>
                            )}
                        </View>
                        {stage === 0 && (
                            <>
                                <Animated.View
                                    style={[{
                                        maxHeight: usePasswordTextHeight,
                                    }, styles.usePasswordTextContainer]}
                                >
                                    <Text
                                        style={[
                                            globalStyles.text,
                                            globalStyles.centeredElement,
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
                        {stage === 1 && (
                            <Text
                                style={[
                                    globalStyles.text,
                                    globalStyles.centeredElement,
                                    { marginVertical: 10 }
                                ]}
                                onPress={() => {
                                    values.code = ''
                                    setStage(0)
                                }}
                            >
                                Вернуться назад
                            </Text>
                        )}
                        <Button
                            title={
                                stage === 0 ?
                                    usePassword ?
                                        'Войти' : 'Далее' :
                                    'Отправить'
                            }
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
    usePasswordTextContainer: {
        height: 40,
        overflow: "hidden",
    },
    passwordField: {
        overflow: "hidden"
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