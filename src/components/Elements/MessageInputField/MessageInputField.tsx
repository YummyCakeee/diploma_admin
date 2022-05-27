import React, { useRef, useEffect } from "react"
import { StyleSheet, View, TextInput, TouchableOpacity, Animated, Easing } from 'react-native'
import { SendIcon } from "../Icons/Index"

type messageInputFieldType = {
    value: string,
    onChange: (value: string) => void,
    onSend: (value: string) => void,
    style?: {}
}


const MessageInputField: React.FC<messageInputFieldType> = ({
    value = "",
    onChange = () => {},
    onSend = (value) => {},
    style,
    ...props
}) => {

    const sendIconRef = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (value.trim().length) {
            Animated.timing(sendIconRef, 
                {
                    toValue: 1,
                    duration: 200,
                    easing: Easing.out(Easing.sin),
                    useNativeDriver: true,
                }).start()
        }
        else {
            Animated.timing(sendIconRef, 
                {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.out(Easing.circle),
                    useNativeDriver: true,
                }).start()
        }
    }, [value])

    return (
        <View
            style={[
                styles.container,
                style
            ]}
        >
            <View
                style={styles.section}
            >
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="gray"
                    multiline
                    scrollEnabled
                    style={styles.textField}
                    {...props}
                />
                <Animated.View
                    style={{transform: [{scale: sendIconRef}]}}
                >
                    <TouchableOpacity
                        onPress={() => onSend(value)}
                    >
                        <SendIcon
                            color="#fff"
                            width={25}
                            height={25}
                        />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        minHeight: 50,
        maxHeight: 100,
        backgroundColor: 'rgb(48, 45, 55)',
        display: 'flex',
        justifyContent: 'center'
    },
    section: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    textField: {
        color: '#fff',
        fontSize: 18,
        padding: 0,
        width: '90%',
    }
})

export default MessageInputField