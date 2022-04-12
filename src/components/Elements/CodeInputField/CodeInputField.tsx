import globalStyles from "global/styles/styles";
import React, { useRef, useState, useEffect, createRef } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import AnimatedFieldError from 'components/Elements/AnimatedFieldError/AnimatedFieldError'

type codeInputFieldProps = {
    value: string,
    onChange: (value: string) => void,
    length: number,
    error: string,
    style?: {}
}

const CodeInputField: React.FC<codeInputFieldProps> = ({
    value = "",
    onChange,
    length = 4,
    error = '',
    style,
    ...props
}) => {
    const sectionsRefs = useRef<React.RefObject<TextInput>[]>([])
    const [values, setValues] = useState(new Map<number, string>([]))
    const resendCodeTimer = useRef<NodeJS.Timeout>()
    const [resendCodeTimeLeft, setResendCodeTimeLeft] = useState(90)

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

    const onResendCodePress = () => {
        setResendCodeTimeLeft(90)
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
                        style={styles.inputFieldSection}
                        maxLength={1}
                        value={value.charAt(index)}
                        onFocus={() => onFocus(value)}
                        onChangeText={
                            (value) => onChangeText(value, index)
                        }
                        keyboardType='decimal-pad'
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
                        styles.resendCodeText
                    ]}
                    onPress={onResendCodePress}
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