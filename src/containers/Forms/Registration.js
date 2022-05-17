import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, NativeModules } from "react-native";
import globalStyles from "global/styles/styles";
import Button from "components/Elements/Button/Button";
import { Formik, Field } from "formik";
import FormFieldInput from "containers/Forms/FormFieldInput";
import FormCodeFieldInput from "containers/Forms/FormCodeFieldInput";
import axiosAPI, { axiosAPI2 } from "utils/axios";
import { phoneNumberFormatter, simplePhoneNumberFormatter } from "utils/formatters";
import { passwordValidator, phoneNumberValidator, smsCodeValidator } from "utils/validators";
import { ORGANIZATION_ID, USER_TYPE } from "constants/application";
import { ENDPOINT_MAIN_REG, ENDPOINT_USER } from "constants/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "store/actions/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-simple-toast'
import { Color } from "global/styles/constants";
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator";

const Registration = ({
    onRegSuccess = () => { },
    onToggleSignType = () => { }
}) => {
    const [stage, setStage] = useState(0)
    const passwordFieldHeight = useRef(new Animated.Value(0)).current
    const [sendCodeRemainingTime, setSendCodeRemainingTime] = useState(90)
    const dispatch = useDispatch()
    
    useEffect(() => {
        Animated.timing(passwordFieldHeight,
            {
                toValue: 100,
                duration: 400,
                easing: Easing.in(Easing.linear),
                useNativeDriver: false,
            }).start()
    }, [])

    const onSubmit = async (values) => {
        if (stage === 0) {
            const data = {
                action: "request",
                org: ORGANIZATION_ID,
                fingerprint: NativeModules.PlatformConstants.Fingerprint,
                phone: simplePhoneNumberFormatter(values.phone),
                password: values.password,
                userType: USER_TYPE
            }
            return await axiosAPI.post(ENDPOINT_MAIN_REG, data)
                .then(res => {
                    if (res.data?.success){
                        setSendCodeRemainingTime(res.data.data.remaining_time)
                        setStage(1)
                    } else if (!res.data?.success) {
                        if (res.data.data.remaining_time) {
                            Toast.show(`Код уже был отправлен на номер ${values.phone}`)
                            setSendCodeRemainingTime(res.data.data.remaining_time)
                            setStage(1)
                        }
                        else Toast.show(`Ошибка: ${res.data.data.message}`)
                    }
                })
                .catch(error => {
                    Toast.show("Произошла ошибка при запросе")
                })
        }
        if (stage === 1) {
            const data = {
                action: "confirm",
                org: ORGANIZATION_ID,
                fingerprint: NativeModules.PlatformConstants.Fingerprint,
                phone: simplePhoneNumberFormatter(values.phone),
                password: values.password,
                code: Number(values.code),
                userType: USER_TYPE,
            }
            return await axiosAPI.post(ENDPOINT_MAIN_REG, data).then(
                async (res) => {
                    if (res.data?.success){
                        const authToken = res.data.data.auth
                        const refreshToken = res.data.data.refresh
                        if (authToken && refreshToken) {
                            return await updateUserInfo(authToken, refreshToken)
                        }
                    }
                }).catch(error => {
                    Toast.show("Произошла ошибка при запросе")
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
                name: data.first_name,
                surname: data.second_name,
                patronymic: data.third_name,
                phone: data.phone,
                email: data.email
            }
            dispatch(updateUser(userData))
            AsyncStorage.setItem('authToken', userData.authToken)
            AsyncStorage.setItem('refreshToken', userData.refreshToken)
            onRegSuccess()
        }).catch(err => {
            Toast.show("Произошла ошибка при обновлении данных пользователя")
            setStage(0)
        })

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

    return (
        <View>
            <Formik
                validateOnMount
                initialValues={{
                    phone: '+7',
                    password: ''
                }}
                onSubmit={onSubmit}
            >
                {({ handleSubmit, isValid, values }) => (
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
                                            validate={passwordValidator}
                                            placeholder="Придумайте пароль"
                                            secureTextEntry
                                        />
                                    </Animated.View>
                                </>
                            )}
                            {stage === 1 && (
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
                                        endpoint={ENDPOINT_MAIN_REG}
                                    />
                                </>
                            )}
                        </View>
                        {stage === 0 && (
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
                                'Далее' :
                                stage === 1 ? 
                                'Отправить' :
                                'Регистрация'
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
    passwordField: {
        overflow: "hidden"
    },
    enterCodeText: {
        textAlign: 'center',
        marginBottom: 10,
    },
    enterCodeTextPhone: {
        color: Color.SoftBlue
    }
})

export default Registration