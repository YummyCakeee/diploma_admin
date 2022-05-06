import React, { useState, useRef } from "react"
import { StyleSheet, Text, View, Dimensions, KeyboardAvoidingView, Platform } from "react-native"
import ScreenTemplate from "components/ScreenTemplate/ScreenTemplate"
import globalStyles from "global/styles/styles"
import MessageInputField from "components/Elements/MessageInputField/MessageInputField"
import { ScrollView } from "react-native-gesture-handler"
import Message from "./Message"
import { LoadingIcon } from "components/Elements/Icons/Index"

const OnlineChatContainer = () => {
    const userID = '0888-kfier-rrmfifd-32323'
    const [messages, setMessages] = useState([
        {
            text: 'Лалалалалала',
            date: new Date(),
            user: '0888-kfier-nmee72-32323'
        },
        {
            text: 'Как твои дела?',
            date: new Date(),
            user: '0888-kfier-nmee72-32323'
        },
        {
            text: 'Вполне неплохо',
            date: new Date(),
            user: '0888-kfier-rrmfifd-32323'
        },
        {
            text: 'Это замечательно',
            date: new Date(),
            user: '0888-kfier-nmee72-32323'
        },
        {
            text: 'Слушайте. То, как вы побрили мне подмышки в прошлый раз, ' + 
            'было чем-то невероятным. Я обязательно приду к вам ещё раз!',
            date: new Date(),
            user: '0888-kfier-rrmfifd-32323'
        },
        {
            text: 'К сожалению, мы больше не предоставляем услугу по бритью подмышек...',
            date: new Date(),
            user: '0888-kfier-nmee72-32323'
        },
        {
            text: 'Я плачу...((((',
            date: new Date(),
            user: '0888-kfier-rrmfifd-32323'
        },
        {
            text: 'Мы с радостью предоставим вам в качестве утешения услугу "Выщипывание волос на голове"! Записать вас на удобное время?',
            date: new Date(),
            user: '0888-kfier-nmee72-32323'
        },
        {
            text: 'А это не больно?',
            date: new Date(),
            user: '0888-kfier-rrmfifd-32323'
        },
        {
            text: 'Чертовски больно!',
            date: new Date(),
            user: '0888-kfier-nmee72-32323'
        },
        {
            text: 'Тогда записывайте',
            date: new Date(),
            user: '0888-kfier-rrmfifd-32323'
        },
    ])
    const [currentMessage, setCurrentMessage] = useState('')
    const messagesListRef = useRef(null)
    const onMessageSend = (value) => {
        value = value.trim()
        if (value.length) {
            setMessages([...messages, { text: value, date: new Date(), user: userID }])
            setCurrentMessage('')
            messagesListRef.current.scrollToEnd()
        }
    }

    return (
        <ScreenTemplate
            scrollable={false}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                    <View style={styles.messagesContainer}>
                        {messages.length === 0 ? (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'space-around'
                                }}
                            >
                                <Text
                                    style={styles.noMessagesText}
                                >
                                    У вас пока нет сообщений
                                </Text>
                            </View>
                    ) : (
                        <ScrollView
                            ref={messagesListRef}
                        >
                            {messages.map((el, index) => (
                                <Message
                                    key={index}
                                    text={el.text}
                                    date={el.date}
                                    fromThisUser={el.user === userID}
                                    thisUserMessageStyle={globalStyles.thisUserMessage}
                                    otherUserMessageStyle={globalStyles.otherUserMessage}
                                />
                            ))}
                        </ScrollView >
                    )}
                    </View>
                    <View
                        style={styles.messageInputContainer}
                    >
                        <MessageInputField
                            value={currentMessage}
                            onChange={setCurrentMessage}
                            placeholder="Введите сообщение"
                            onSend={onMessageSend}
                        />
                    </View>
            </KeyboardAvoidingView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: Dimensions.get('window').height - 70,
    },
    messagesContainer: {
        flex: 1
    },
    noMessagesText: {
        color: "gray",
        fontSize: 16,
        alignSelf: "center",
    },
    messageInputContainer: {
        width: '100%',
        bottom: 0
    },
})

export default OnlineChatContainer