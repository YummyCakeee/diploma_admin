import { Color } from "global/styles/constants"
import globalStyles from "global/styles/styles"
import React, { useState, useRef, useEffect } from "react"
import { StyleSheet, View, Text, TouchableOpacity, StyleProp } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { ExclamationMarkIcon, SendIcon } from "components/Elements/Icons/Index"

type messageProps = {
    userName: string,
    text: string,
    date: Date,
    status: messageStatus,
    fromThisUser: boolean,
    thisUserOnLeft: boolean,
    thisUserMessageStyle: {},
    otherUserMessageStyle: {},
    showUserName: boolean,
    onPress: (measure: {}) => void
    style?: StyleProp<View>
}

export enum messageStatus {
    SENDING, ERROR, UNREAD, READ
}

const Message: React.FC<messageProps> = ({
    userName = '',
    text = '',
    date = new Date(),
    status = messageStatus.UNREAD,
    fromThisUser = false,
    thisUserOnLeft = false,
    thisUserMessageStyle,
    otherUserMessageStyle,
    showUserName = true,
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
        ref.current?.measure((x, y, w, h, pX, pY) => onPress({ x, y, w, h, pX, pY }))
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
            <View
                style={[
                    styles.messageStatus,
                    fromThisUser ?
                        (thisUserOnLeft ?
                            styles.messageStatusRight :
                            styles.messageStatusLeft) :
                        (thisUserOnLeft ?
                            styles.messageStatusLeft :
                            styles.messageStatusRight)
                ]}
            >
                {status === messageStatus.UNREAD ?
                    <View style={styles.messageUnreadStatus}></View> :
                    status === messageStatus.ERROR ?
                        <ExclamationMarkIcon
                            color={Color.SoftRed}
                            width={10}
                            height={10}
                        /> :
                        status === messageStatus.SENDING ?
                            <SendIcon
                                color={Color.White}
                                width={10}
                                height={10}
                            /> :
                            null
                }
            </View>
            {showUserName && (
                <View
                    style={styles.messageUserName}
                >
                    <Text
                        style={[
                            globalStyles.text,
                            fromThisUser ? 
                            globalStyles.thisUserMessageName :
                            globalStyles.otherUserMessageName
                        ]}
                    >
                        {userName ? userName : 'Пользователь'}
                    </Text>
                </View>
            )}
            <View
                style={styles.horizontalSection}
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
        marginVertical: 7,
        marginHorizontal: 10,
        borderRadius: 10,
        padding: 5,
        backgroundColor: '#71B6C3',
        minWidth: '30%',
        maxWidth: '65%'
    },
    messageUserName: {
        paddingHorizontal: 3,
    },
    horizontalSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    messageTextContainer: {
        paddingHorizontal: 3,
        flexShrink: 1,
    },
    messageText: {
        color: '#fff',
        fontSize: 16,

    },
    messageDateContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        bottom: -3,
    },
    messageDate: {
        color: 'rgb(230, 230, 230)',
        fontSize: 12,
    },
    messageStatus: {
        position: "absolute",
        bottom: 15,
    },
    messageStatusLeft: {
        left: -20,
    },
    messageStatusRight: {
        right: -20,
    },
    messageUnreadStatus: {
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