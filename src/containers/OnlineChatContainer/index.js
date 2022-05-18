import React, { useState, useRef, useEffect } from "react"
import { StyleSheet, Text, View, Dimensions, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native"
import ScreenTemplate from "components/ScreenTemplate/ScreenTemplate"
import globalStyles from "global/styles/styles"
import MessageInputField from "components/Elements/MessageInputField/MessageInputField"
import Message, { MessagesDateSplitter } from "./Message"
import { Color } from "global/styles/constants"
import { CopyIcon, LoadingIcon, TrashIcon } from "components/Elements/Icons/Index"
import Toast from 'react-native-simple-toast'
import ContextMenu from "components/Elements/ContextMenu/ContextMenu"

const OnlineChatContainer = () => {

    const socket = useRef(new WebSocket('wss://pure-beach-58958.herokuapp.com')).current
    const [isConnected, setIsConnected] = useState(false)
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [contextMenuItems, setContextMenuItems] = useState([])
    const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0})
    const userID = '0888-kfier-rrmfifd-32323'
    const [currentMessage, setCurrentMessage] = useState('')
    const [selectedMessage, setSelectedMessage] = useState(null)
    const messagesListRef = useRef(null)

    useEffect(() => {
        //  Получаем сообщения от сервера
        const data = [
            {
                id: '1',
                text: 'Как твои дела?',
                date: new Date('2022-04-03T12:05:07Z'),
                user: '0888-kfier-nmee72-32323',
                read: true
            },
            {
                id: '2',
                text: 'Вполне неплохо',
                date: new Date('2022-04-03T12:10:07Z'),
                user: '0888-kfier-rrmfifd-32323',
                read: true
            },
            {
                id: '3',
                text: 'Это замечательно',
                date: new Date('2022-04-03T12:13:07Z'),
                user: '0888-kfier-nmee72-32323',
                read: true
            },
            {
                id: '4',
                text: 'Слушайте. То, как вы побрили мне подмышки в прошлый раз, ' +
                    'было чем-то невероятным. Я обязательно приду к вам ещё раз!',
                date: new Date('2022-04-06T20:44:07Z'),
                user: '0888-kfier-rrmfifd-32323',
                read: true
            },
            {
                id: '5',
                text: 'К сожалению, мы больше не предоставляем услугу по бритью подмышек...',
                date: new Date('2022-04-06T20:56:22Z'),
                user: '0888-kfier-nmee72-32323',
                read: true
            },
            {
                id: '6',
                text: 'Я плачу...((((',
                date: new Date('2022-04-06T20:56:43Z'),
                user: '0888-kfier-rrmfifd-32323',
                read: true
            },
            {
                id: '7',
                text: 'Мы с радостью предоставим вам в качестве утешения услугу "Выщипывание волос на голове"! Записать вас на удобное время?',
                date: new Date('2022-04-06T21:01:12Z'),
                user: '0888-kfier-nmee72-32323',
                read: true
            },
            {
                id: '8',
                text: 'А это не больно?',
                date: new Date('2022-04-07T08:21:03Z'),
                user: '0888-kfier-rrmfifd-32323',
                read: true
            },
            {
                id: '9',
                text: 'Чертовски больно!',
                date: new Date('2022-04-07T08:22:18Z'),
                user: '0888-kfier-nmee72-32323',
                read: true
            },
            {
                id: '10',
                text: 'Тогда записывайте',
                date: new Date('2022-04-07T08:24:50Z'),
                user: '0888-kfier-rrmfifd-32323',
                read: false
            },
        ]
        const grouppedMessages = []
        data.forEach(el => {
            const dateListIndex = grouppedMessages.findIndex(a => a.date === el.date.toLocaleDateString())
            if (dateListIndex === -1)
                grouppedMessages.push({ date: el.date.toLocaleDateString(), messages: [el] })
            else grouppedMessages[dateListIndex].messages.push(el)
        })
        setMessages(grouppedMessages)
        socket.onopen = () => {
            setIsConnected(true)

        }
        socket.onclose = () => {
            setIsConnected(false)
        }
        socket.onerror = (e) => {
            Toast.show(`Произошла ошибка: ${e.message}`)
            setIsConnected(false)
        }
        socket.onmessage = (e) => {
            console.log(e.data)
        }
    }, [])

    useEffect(() => {
        if (!isContextMenuOpen)
            setSelectedMessage(null)
    }, [isContextMenuOpen])
    const onMessageSend = (value) => {
        value = value.trim()
        if (value.length) {
            setMessages([...messages, { text: value, date: new Date(), user: userID }])
            setCurrentMessage('')
            messagesListRef.current.scrollToEnd()
        }
    }
    const onMessagePress = ({msg, measure}) => {
        setSelectedMessage(msg.id)
        setContextMenuItems([
                {
                    icon: <CopyIcon {...{color: Color.White}}/>,
                    text: 'Копировать',
                    onPress: () => console.log('Copied')
                },
                {
                    icon: <TrashIcon {...{color: Color.SoftRed}}/>,
                    text: 'Удалить',
                    onPress: () => console.log('Deleting')
                },
            ])
        messagesListRef.current?.measure((x, y, w, h, pX, pY) => {
            let posY = measure.pY - measure.h / 2
            if (posY + 200 > pY + h) {
                posY-= (posY + 200) - (pY + h)
            } 
            setContextMenuPosition({
                    x: Dimensions.get('window').width / 2 -
                        (msg.user === userID ? 0 : 100),
                    y: posY
            })
            setIsContextMenuOpen(true)
        })
    }

    return (
        <ScreenTemplate
            scrollable={false}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                {!isConnected && (<View
                    style={styles.statusContainer}
                >
                    <>
                        <Text
                            style={[
                                globalStyles.text,
                                styles.statusContainerText
                            ]}
                        >
                            Обновление
                        </Text>
                    </>
                    <LoadingIcon
                        width={10}
                        height={10}
                        color={Color.White} />
                </View>
                )}
                <View style={styles.messagesContainer}>
                <ContextMenu
                        isOpen={isContextMenuOpen}
                        setIsOpen={setIsContextMenuOpen}
                        items={contextMenuItems}
                        position={contextMenuPosition}
                        enableBackground
                    />
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
                                <View
                                    key={index}
                                >
                                    <MessagesDateSplitter
                                        date={el.date}
                                    />
                                    {el.messages.map((msg, index) => (
                                        <Message
                                            key={index}
                                            text={msg.text}
                                            date={msg.date}
                                            read={msg.read}
                                            fromThisUser={msg.user === userID}
                                            thisUserMessageStyle={globalStyles.thisUserMessage}
                                            otherUserMessageStyle={globalStyles.otherUserMessage}
                                            onPress={(measure) => onMessagePress({msg, measure})}
                                            style={
                                                selectedMessage === msg.id ? 
                                                styles.selectedMessage :
                                                null
                                            }
                                        />
                                    ))}
                                </View>
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
    statusContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        position: "absolute",
        zIndex: 5001,
        alignSelf: "center",
        marginTop: 20,
        borderRadius: 10,
        padding: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    statusContainerText: {
        marginRight: 5,
    },
    messagesContainer: {
        flex: 1,
    },
    selectedMessage: {
        backgroundColor: 'rgb(200, 200, 200)'
    },
    noMessagesText: {
        color: Color.Gray,
        fontSize: 16,
        alignSelf: "center",
    },
    messageInputContainer: {
        width: '100%',
        bottom: 0,
        zIndex: 5001
    },
})

export default OnlineChatContainer