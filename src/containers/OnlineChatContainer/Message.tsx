import React, { useState, useEffect } from "react"
import { StyleSheet, View, Text } from "react-native"

type messageProps = {
    text: string,
    date: Date,
    fromThisUser: boolean,
    thisUserOnLeft: boolean,
    thisUserMessageStyle: {},
    otherUserMessageStyle: {},
    style?: {}
}

const Message: React.FC<messageProps> = ({
    text = '',
    date = new Date(),
    fromThisUser = false,
    thisUserOnLeft = false,
    thisUserMessageStyle,
    otherUserMessageStyle,
    style
}) => {

    const [messageTime, setMessageTime] = useState('')

    useEffect(() => {
        const time = date?.toLocaleTimeString('ru-RU').replace(/:\d+/, '')
        setMessageTime(time)
    }, [date])

    return (
        <View
            style={[
                styles.container,
                {
                    alignSelf: fromThisUser ? !thisUserOnLeft ?
                    'flex-end': 'flex-start' : !thisUserOnLeft ?
                    'flex-start' : 'flex-end',
                },
                style,
                fromThisUser ? thisUserMessageStyle : otherUserMessageStyle
            ]}
        >
            <View
                style={styles.messageTextContainer}
            >
                <Text
                    style={styles.messageText}
                >
                    {text}
                </Text>
            </View>
            <View
                style={styles.messageDateContainer}
            >
                <Text
                    style={styles.messageDate}
                >
                    {messageTime}
                </Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: 40,
        marginVertical: 7,
        marginHorizontal: 10,
        borderRadius: 10,
        padding: 5,
        backgroundColor: '#71B6C3',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'flex-end'        
    },
    messageTextContainer: {
        paddingHorizontal: 3,
        minWidth: '30%',
        maxWidth: '70%',
    },
    messageText: {
        color: '#fff',
        fontSize: 16,
    },
    messageDateContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    messageDate: {
        color: 'rgb(230, 230, 230)',
        fontSize: 12,
    }
})

export default Message