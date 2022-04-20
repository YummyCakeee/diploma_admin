import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing, Alert } from "react-native";
import globalStyles from "global/styles/styles";
import Button from "components/Elements/Button/Button";
import { phoneNumberFormatter, simplePhoneNumberFormatter } from "utils/formatters";
import {
    passwordValidator,
    phoneNumberValidator,
    smsCodeValidator
} from "utils/validators";
import { Formik, Field } from "formik";
import FormFieldInput from "containers/Forms/FormFieldInput";
import FormCodeFieldInput from "containers/Forms/FormCodeFieldInput";
import axiosAPI from "utils/axios";
import { ENDPOINT_MAIN_AUTH } from "constants/endpoints";
import { ORGANIZATION_ID, USER_TYPE } from "constants/application";


const Authorization = ({
    onAuthSuccess = () => { },
    onToggleSignType = () => { }
}) => {
    const [stage, setStage] = useState(0)
    const [usePassword, setUsePassword] = useState(false)
    const passwordFieldHeight = useRef(new Animated.Value(0)).current
    const usePasswordTextHeight = useRef(new Animated.Value(0)).current

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
                type: 'request',
                org: ORGANIZATION_ID,
                phone: simplePhoneNumberFormatter(values.phone),
                userType: USER_TYPE
            }
            if (usePassword)
                data.password = values.password
            return axiosAPI.post(ENDPOINT_MAIN_AUTH, data)
                .then(res => {
                    if (res.data?.ok) {
                        if (usePassword)
                            onAuthSuccess()
                        else setStage(1)
                    }
                    else {
                        Alert.alert('Ошибка', res.data.error_msg)
                    }
                })
                .catch(error => {
                    // if (error.response)
                    //     console.log(error.response.data)
                    Alert.alert('Ошибка', 'Не удалось отправить форму')
                })
        }
        if (stage === 1) {
            let data = {

            }

        }
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