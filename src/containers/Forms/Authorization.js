import React, { useState, useRef, useEffect, useContext } from "react";
import { 
    View, Text, StyleSheet, 
    Animated, Easing, NativeModules 
} from "react-native";
import Toast from 'react-native-simple-toast'
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
import axiosAPI, { axiosAPI2 } from "utils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINT_MAIN_AUTH, ENDPOINT_USER } from "constants/endpoints";
import { ORGANIZATION_ID, USER_TYPE } from "constants/application";
import { useDispatch } from "react-redux";
import { updateUser } from "store/actions/userSlice";
import { Color } from "global/styles/constants";
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator";
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper";


const Authorization = ({
    onAuthSuccess = () => { },
}) => {
    const [stage, setStage] = useState(0)
    const [usePassword, setUsePassword] = useState(false)
    const passwordFieldHeight = useRef(new Animated.Value(0)).current
    const usePasswordTextHeight = useRef(new Animated.Value(0)).current
    const [sendCodeRemainingTime, setSendCodeRemainingTime] = useState(90)
    const dispatch = useDispatch()
    const globalStyles = useContext(GlobalStylesContext)

    useEffect(() => {
        Animated.timing(usePasswordTextHeight,
            {
                toValue: 100,
                duration: 400,
                easing: Easing.out(Easing.linear),
                useNativeDriver: false,
            }).start()
    }, [])

    const onSubmit = async (values) => {
        if (stage === 0) {
            let data = {
                org: ORGANIZATION_ID,
                phone: simplePhoneNumberFormatter(values.phone),
                app_type: USER_TYPE,
                fingerprint: NativeModules.PlatformConstants.Fingerprint,
            }
            if (usePassword) {
                data.action = 'password'
                data.password = values.password

                return await axiosAPI.post(ENDPOINT_MAIN_AUTH, data)
                    .then(async (res) => {
                        if (res.data?.success) {
                            const authToken = res.data.data.auth_token
                            const refreshToken = res.data.data.refresh_token
                            if (authToken && refreshToken) {
                                return await updateUserInfo(authToken, refreshToken)
                            }
                        }
                        else {
                            Toast.show(`Ошибка: ${res.data.data.message}`)
                        }
                    })
                    .catch(error => {
                        Toast.show('Ошибка: Не удалось отправить форму')
                    })
            }

            data.action = 'request'
            return await axiosAPI.post(ENDPOINT_MAIN_AUTH, data)
                .then(res => {
                    if (res.data?.success) {
                        setSendCodeRemainingTime(res.data.data.remaining_time)
                        setStage(1)
                    } else if (!res.data?.success) {
                        if (res.data.data.remaining_time) {
                            Toast.show(`Код уже был отправлен на номер ${values.phone}`)
                            setSendCodeRemainingTime(res.data.data.remaining_time)
                            setStage(1)
                        }
                        else {
                            Toast.show(`Ошибка: ${res.data.data.message}`)
                        }
                    }
                })
                .catch(error => {
                    Toast.show('Ошибка: Не удалось отправить форму')
                })
        }
        if (stage === 1) {
            let data = {
                action: 'confirm',
                org: ORGANIZATION_ID,
                phone: simplePhoneNumberFormatter(values.phone),
                code: values.code,
                app_type: USER_TYPE,
                fingerprint: NativeModules.PlatformConstants.Fingerprint,
            }
            return await axiosAPI.post(ENDPOINT_MAIN_AUTH, data)
                .then(async (res) => {
                    if (res.data?.success) {
                        const authToken = res.data.data.auth_token
                        const refreshToken = res.data.data.refresh_token
                        if (authToken && refreshToken) {
                            return await updateUserInfo(authToken, refreshToken)
                        }
                    } else if (!res.data?.success) {
                        Toast.show(`Ошибка: ${res.data.data.message}`)
                    }
                })
                .catch(error => {
                    Toast.show('Ошибка: Не удалось отправить форму')                    
                })
        }
    }

    const updateUserInfo = async (authToken, refreshToken) =>
        await axiosAPI2.get(ENDPOINT_USER,
            {
                headers: createAuthorizationHeader(authToken)
            }).then(res => {
                const data = res.data.data
                const userData = {
                    authToken,
                    refreshToken,
                    id: data.id,
                    name: data.first_name,
                    surname: data.second_name,
                    patronymic: data.third_name,
                    phone: data.phone,
                    email: data.email,
                    permission: data.permission
                }
                dispatch(updateUser(userData))
                AsyncStorage.setItem('authToken', userData.authToken)
                AsyncStorage.setItem('refreshToken', userData.refreshToken)
                onAuthSuccess()
            }).catch(err => {
                Toast.show("Произошла ошибка при обновлении данных пользователя")
                setStage(0)
            })

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
                {({ handleSubmit, isValid, isSubmitting, values, setFieldError }) => (
                    <View
                        pointerEvents={isSubmitting ? 'none' : 'auto'}
                    >
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
                                        style={styles.inputFieldContainer}
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
                                            style={styles.inputFieldContainer}
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
                                        phone={values.phone}
                                        endpoint={ENDPOINT_MAIN_AUTH}
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
                            primary
                            title={
                                stage === 0 ?
                                    usePassword ?
                                        'Войти' : 'Далее' :
                                    'Отправить'
                            }
                            style={globalStyles.centeredElement}
                            onPress={handleSubmit}
                            disabled={!isValid || isSubmitting}
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
        color: Color.SoftBlue
    },
    inputFieldContainer: {
        marginTop: 10,
    }
})

export default Authorization