import globalStyles from "global/styles/styles";
import React, { useRef, useState, useEffect, createRef } from "react";
import { StyleSheet, TextInput, View, Text, NativeModules } from "react-native";
import AnimatedFieldError from 'components/Elements/AnimatedFieldError/AnimatedFieldError'
import axiosAPI from 'utils/axios'
import { ORGANIZATION_ID, USER_TYPE } from 'constants/application'
import { simplePhoneNumberFormatter } from "utils/formatters";
import Toast from 'react-native-simple-toast'

type codeInputFieldProps = {
    value: string,
    onChange: (value: string) => void,
    length: number,
    error: string,
    startRemainingTime: number,
    phone: string,
    endpoint: string,
    style?: {}
}

const CodeInputField: React.FC<codeInputFieldProps> = ({
    value = "",
    onChange,
    length = 4,
    error = '',
    startRemainingTime = 90,
    phone = '',
    endpoint = '',
    style,
    ...props
}) => {
    const sectionsRefs = useRef<React.RefObject<TextInput>[]>([])
    const [values, setValues] = useState(new Map<number, string>([]))
    const resendCodeTimer = useRef<NodeJS.Timeout>()
    const [resendCodeTimeLeft, setResendCodeTimeLeft] = useState(startRemainingTime)

    useEffect(() => {
        if (resendCodeTimeLeft > 0) {
            resendCodeTimer.current = setTimeout(() => {
                setResendCodeTimeLeft(resendCodeTimeLeft - 1)
            }, 1000)
        }
        return () => {
            if (resendCodeTimer.current)
                clearTimeout(resendCodeTimer.current)
        }
    }, [resendCodeTimeLeft, resendCodeTimer])

    useEffect(() => {
        sectionsRefs.current = []
        const vals = new Map<number, string>([])
        for (let i = 0; i < length; i++) {
            sectionsRefs.current.push(createRef())
            vals.set(i, value.charAt(i))
        }
        setValues(vals)
    }, [length, value])

    useEffect(() => {
        setResendCodeTimeLeft(startRemainingTime)
    }, [startRemainingTime])

    const onCodeResendRequest = async () => {
        const data = {
            action: "request",
            org: ORGANIZATION_ID,
            phone: simplePhoneNumberFormatter(phone),
            userType: USER_TYPE,
            fingerprint: NativeModules.PlatformConstants.Fingerprint
        }
        await axiosAPI.post(endpoint, data)
            .then(res => {
                if (res.data?.success) {
                    setResendCodeTimeLeft(res.data.data.remaining_time)
                } else if (!res.data?.success) {
                    Toast.show(`Ошибка: ${res.data.message}`)
                }
            })
            .catch(error => {
                Toast.show('Произошла ошибка')
            })
    }

    const onChangeText = (value: string, index: number) => {
        const vals = values
        vals.set(index, value)
        setValues(vals)
        let newValue = ""
        vals.forEach(el => newValue += el)
        onChange(newValue)
        if (value) {
            focusOnFirstEmpty(newValue)
        }
        else {
            focusOnLastNonEmpty(newValue)
        }
    }

    const onFocus = (value: string) => {
        if (value === '')
            focusOnFirstEmpty(value)
    }

    const focusOnFirstEmpty = (value: string) => {
        sectionsRefs.current[value.length]?.current?.focus()
    }

    const focusOnLastNonEmpty = (value: string) => {
        sectionsRefs.current[value.length - 1]?.current?.focus()
    }

    return (
        <>
            <View
                style={[
                    globalStyles.centeredElement,
                    styles.inputField,
                    style
                ]}
            >
                {sectionsRefs.current.map((el, index) => (
                    <TextInput
                        key={index}
                        ref={el}
                        maxLength={1}
                        value={value.charAt(index)}
                        onFocus={() => onFocus(value)}
                        onChangeText={
                            (value) => onChangeText(value, index)
                        }
                        keyboardType='decimal-pad'
                        style={[
                            styles.inputFieldSection,
                            style]
                        }
                    />))
                }
            </View>
            <AnimatedFieldError
                    {...{
                        error: error,
                        ...props
                    }}
                />
            <View>
                <Text
                    style={[
                        globalStyles.text,
                        globalStyles.centeredElement,
                        styles.resendCodeText,
                        style
                    ]}
                    onPress={onCodeResendRequest}
                >{resendCodeTimeLeft !== 0 ?
                    ('Вы можете запросить код повторно через ' + 
                    resendCodeTimeLeft + ' сек.') :
                    `Запросить код заново`}
                </Text>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    inputField: {
        display: 'flex',
        flexDirection: 'row',
    },
    inputFieldSection: {
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        width: 40,
        marginHorizontal: 3,
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    resendCodeText: {
        marginTop: 15,
        width: 200,
        textAlign: 'center'
    }
})

export default CodeInputField