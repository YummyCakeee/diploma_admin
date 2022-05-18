import { Color } from "global/styles/constants"
import globalStyles from "global/styles/styles"
import React, { useState, useRef, useEffect } from "react"
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, StyleProp } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import ContextMenu from "components/Elements/ContextMenu/ContextMenu"

type messageProps = {
    text: string,
    date: Date,
    read: boolean,
    fromThisUser: boolean,
    thisUserOnLeft: boolean,
    thisUserMessageStyle: {},
    otherUserMessageStyle: {},
    onPress: (measure: {}) => void
    style?: StyleProp<View>
}

const Message: React.FC<messageProps> = ({
    text = '',
    date = new Date(),
    read = false,
    fromThisUser = false,
    thisUserOnLeft = false,
    thisUserMessageStyle,
    otherUserMessageStyle,
    onPress = () => { },
    style
}) => {
    const [messageTime, setMessageTime] = useState('')
    const ref = useRef<TouchableOpacity>(null)
    useEffect(() => {
        const time = date?.toLocaleTimeString('ru-RU').replace(/:\d+$/, '')
        setMessageTime(time)
    }, [date])

    const onMessagePress = () => {
        ref.current?.measure((x, y, w, h, pX, pY) => onPress({x, y, w, h, pX, pY}))
    }

    return (
        <TouchableOpacity
            ref={ref}
            activeOpacity={1}
            onPress={onMessagePress}
            style={[
                styles.container,
                {
                    alignSelf: fromThisUser ? !thisUserOnLeft ?
                        'flex-end' : 'flex-start' : !thisUserOnLeft ?
                        'flex-start' : 'flex-end',
                },
                fromThisUser ? thisUserMessageStyle : otherUserMessageStyle,
                style,
            ]}
        >
            {fromThisUser && !read && (
                <View style={styles.messageUnreadStatus}></View>
            )}
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
        </TouchableOpacity>
    )
}

export const MessagesDateSplitter: React.FC<{ date: Date }> = ({ date }) => {
    return (
        <View
            style={styles.splitterContainer}
        >
            <LinearGradient
                colors={[
                    'rgba(100, 100, 100, 0)',
                    'rgba(100, 100, 100, 1)'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.splitterGradient}
            />
            <Text
                style={[
                    globalStyles.text,
                    styles.splitterText
                ]}
            >
                {date}
            </Text>
            <LinearGradient
                colors={[
                    'rgba(100, 100, 100, 1)',
                    'rgba(100, 100, 100, 0)'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.splitterGradient}
            />
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
        alignContent: 'flex-end',
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
    },
    messageUnreadStatus: {
        position: "absolute",
        left: -20,
        bottom: 15,
        backgroundColor: Color.OceanBlue,
        width: 10,
        height: 10,
        borderRadius: 10,
    },
    splitterContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    splitterText: {
        fontSize: 12,
        marginHorizontal: 5,
    },
    splitterGradient: {
        width: 100,
        height: 1
    },
})

export default Message