import React, { useState, useRef, useEffect, createRef, useContext } from "react"
import { 
    StyleSheet,
    Text, 
    View, 
    Dimensions,
    KeyboardAvoidingView, 
    Platform, 
    ScrollView,
    AppState,
    NativeModules
} from "react-native"
import MessageInputField from "components/Elements/MessageInputField/MessageInputField"
import Message, { MessagesDateSplitter, messageStatus } from "./Message"
import { Color } from "global/styles/constants"
import { ArrowIcon, CopyIcon, LoadingIcon, SendIcon, TrashIcon } from "components/Elements/Icons/Index"
import ContextMenu from "components/Elements/ContextMenu/ContextMenu"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import * as messageActions from './chatActions'
import { dateTimeSplitter } from "utils/splitters"
import { dateSwapYearAndMonthFormatter } from "utils/formatters"
import { useNavigation } from "@react-navigation/native"
import { Screen } from "components/AppNavigation/AppNavigation"
import { createChatRoomEndpoint } from "utils/apiHelpers/endpointGenerators"
import Clipboard from '@react-native-clipboard/clipboard'
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"
import { TouchableOpacity } from "react-native-gesture-handler"
import useIsMounted from "utils/components/useIsMounted"
import Toast from 'react-native-simple-toast'

const OnlineChatRoomContainer = ({
    route,
}) => {

    const [isConnected, setIsConnected] = useState(false)
    const [isConnectingStatus, setIsConnectingStatus] = useState(true)
    const [chatRoomId, setChatRoomId] = useState('')
    const [chatName, setChatName] = useState('')
    const [chatUserList, setChatUserList] = useState(null)
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [contextMenuItems, setContextMenuItems] = useState([])
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
    const [currentMessage, setCurrentMessage] = useState('')
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [serverReceivedData, setServerReceivedData] = useState(null)
    const [appState, setAppState] = useState(AppState.currentState)
    const [oldMessagesAreLoaded, setOldMessagesAreLoaded] = useState(false)
    const messagesListRef = useRef(null)
    const socket = useRef()
    const userInfo = useSelector(userSelector)
    const navigation = useNavigation()
    const globalStyles = useContext(GlobalStylesContext)
    const isMounted = useIsMounted()

    useEffect(() => {
        const appStateSubscription = AppState.addEventListener('change', (nextState) => {
            setAppState(nextState)
        })
        return () => appStateSubscription.remove()
    }, [])

    useEffect(() => {
        if (route?.params.roomId !== '') {
            setChatRoomId(route.params.roomId)
            setChatName(route.params.chatName)
            const chatUsers = new Map()
            route.params.chatUserList.forEach(el => {
                chatUsers.set(el.id, {
                    id: el.id,
                    name: el.first_name,
                    surname: el.second_name,
                })
            })
            setChatUserList(chatUsers)
        }
        else {
            navigation.navigate(Screen.OnlineChatRoomList)
        }
    }, [route])

    useEffect(() => {
        if (chatRoomId && !isConnected && appState === 'active')
            connectSocket()
        return () => {
            if (isConnected && socket.current && appState !== 'background') {
                socket.current.close()
            }
        }
    }, [isConnected, chatRoomId, appState])

    useEffect(() => {
        if (!isContextMenuOpen)
            setSelectedMessage(null)
    }, [isContextMenuOpen])

    useEffect(() => {
        let isConnectingStatusTimeout = -1
        if (!isConnected)
            isConnectingStatusTimeout = setTimeout(() => {
                setIsConnectingStatus(true)
            }, 5000);
        else setIsConnectingStatus(false)
        return () => {
            clearTimeout(isConnectingStatusTimeout)
        }
    }, [isConnected])

    useEffect(() => {
        if (serverReceivedData) {
            onMessagesReceived(JSON.parse(serverReceivedData))
            setServerReceivedData(null)
        }
    }, [serverReceivedData])

    const connectSocket = () => {
        socket.current = new WebSocket('wss://pure-beach-58958.herokuapp.com' +
            createChatRoomEndpoint(chatRoomId) + 
            `?fingerprint=${NativeModules.PlatformConstants.Fingerprint}`,
            null, {headers: createAuthorizationHeader(userInfo.authToken)})
        socket.current.onopen = () => {
            if (messages.length === 0) {
                if (isMounted.current)
                    getMessages()
            }
            if (isMounted.current)
                setIsConnected(true)
        }
        socket.current.onclose = (e) => {
            if (isMounted.current)
                setIsConnected(false)
            if (e.code !== 0) {

            }
        }
        socket.current.onerror = (e) => {
            if (isMounted.current)
                setIsConnected(false)
        }
        socket.current.onmessage = (e) => {
            if (isMounted.current)
                setServerReceivedData(e.data)
        }
    }

    const getMessages = (startDate = null, endDate = null) => {
        try {
            const data = {}
            data.action = startDate || endDate ?
                messageActions.LOAD_MESSAGES :
                messageActions.LOAD_ALL_MESSAGES
            if (startDate)
                data.start_date = startDate
            if (endDate)
                data.end_date = endDate
            socket.current?.send(JSON.stringify(data))
        }
        catch (err) {
            Toast.show("Не удалось загрузить все сообщения")
        }
    }

    const setMessagesRead = (...readMessages) => {
        const data = {
            action: messageActions.READ_MESSAGES,
            messages: []
        }
        readMessages.forEach(el => {
            const message = {
                id: el.id,
                user_id: el.user
            }
            data.messages.push(message)
        })
        try {
            socket.current?.send(JSON.stringify(data))
        }
        catch (err) {
        }
    }

    const setAllMessagesRead = () => {
        const unreadMessages = messages.filter(el =>
            el.status === messageStatus.UNREAD &&
            el.user !== userInfo.id
        )
        setMessagesRead(...unreadMessages)
    }

    const onMessageSend = (value) => {
        const trimmedValue = value.trim()
        if (trimmedValue.length) {
            try {
                const data = {
                    action: messageActions.NEW_MESSAGE,
                    messages: [{
                        message: trimmedValue,
                        user_id: userInfo.id,
                    }]
                }
                socket.current?.send(JSON.stringify(data))
                const sendingMessage = {
                    text: trimmedValue,
                    user: userInfo.id,
                    date: new Date(),
                    status: messageStatus.SENDING
                }

                const copiedMessages = getMessageListCopy(messages)
                addMessageToList(copiedMessages, sendingMessage)
                setMessages(copiedMessages)
                messagesListRef.current?.scrollToEnd()
                setCurrentMessage('')
                setAllMessagesRead()
            }
            catch (err) {
            }
        }
    }

    const onMessagesReceived = (data) => {
        switch (data?.action) {
            case messageActions.NEW_MESSAGE:
                onServerNewMessages(data)
                break
            case messageActions.LOAD_ALL_MESSAGES:
                onServerLoadAllMessages(data)
                break
            case messageActions.DELETE_MESSAGE:
                onServerDeleteMessages(data)
                break
            case messageActions.READ_MESSAGES:
                onServerReadMessages(data)
                break
        }
    }

    const onServerNewMessages = (data) => {
        const copiedMessages = getMessageListCopy(messages)
        data.messages.forEach(el => {
            if (el.user_id === userInfo.id) {
                deleteMessageFromList(copiedMessages, msg => msg.status === messageStatus.SENDING &&
                    msg.text === el.message)
            }
            const message = {
                id: el.id,
                user: el.user_id,
                text: el.message,
                status: messageStatus.UNREAD,
                date: new Date(el.date),
                ref: createRef()
            }
            addMessageToList(copiedMessages, message)
        })
        sortMessageList(copiedMessages)
        setMessages(copiedMessages)
    }

    const onServerLoadAllMessages = (data) => {
        const allMessages = []
        const unreadMessages = []
        data.messages?.forEach(el => {
            const message = {
                id: el.id,
                text: el.message,
                date: new Date(el.date),
                user: el.user_id,
                status:
                    el.user_id !== userInfo.id ?
                        messageStatus.READ :
                        el.read ?
                            messageStatus.READ :
                            messageStatus.UNREAD,
                ref: createRef()
            }
            addMessageToList(allMessages, message)
            if (el.user_id !== userInfo.id && !el.read)
                unreadMessages.push(message)
        })
        sortMessageList(allMessages)
        setMessages(allMessages)
        setMessagesRead(...unreadMessages)
    }

    const onServerDeleteMessages = (data) => {
        const copiedMessages = getMessageListCopy(messages)
        data.messages.forEach(el => {
            deleteMessageFromList(copiedMessages, msg => msg.id === el.id)
        })
        setMessages(copiedMessages)
        setIsContextMenuOpen(false)
    }

    const onServerReadMessages = (data) => {
        ''
        const copiedMessages = getMessageListCopy(messages)
        data.messages.forEach(el => {
            const readMessage = findMessage(copiedMessages, msg => msg.id === el.id)
            if (readMessage) {
                readMessage.status = messageStatus.READ
            }
        })
        setMessages(copiedMessages)
    }

    const addMessageToList = (messageList, message) => {
        const localeDate = dateSwapYearAndMonthFormatter(dateTimeSplitter(message.date).date)
        const dateListIndex = messageList.
            findIndex(a => a.date === localeDate)
        if (dateListIndex === -1)
            messageList.push({ date: localeDate, messages: [message] })
        else messageList[dateListIndex].messages.push(message)
    }

    const sortMessageList = (messageList) => {
        messageList.sort((a, b) => 
            new Date(dateSwapYearAndMonthFormatter(a.date, '-')) >= 
            new Date(dateSwapYearAndMonthFormatter(b.date, '-')))
        messageList.forEach(el => {
            el.messages.sort((a, b) => 
            a.date >= b.date)
        })
    }

    const deleteMessageFromList = (messageList, predicate) => {
        for (let i = 0; i < messageList.length; i++) {
            const messageIndex = messageList[i].messages.findIndex(predicate)
            if (messageIndex !== -1) {
                messageList[i].messages.splice(messageIndex, 1)
                if (messageList[i].messages.length <= 0) {
                    messageList.splice(i, 1)
                }
                break
            }
        }
    }

    const findMessage = (messageList, predicate) => {
        for (let i = 0; i < messageList.length; i++) {
            const message = messageList[i].messages.find(predicate)
            if (message) return message
        }
        return null
    }

    const getMessageListCopy = (messageList) => {
        const messageListCopy = messageList.map(el => (
            {
                date: el.date,
                messages: [...el.messages]
            }
        ))
        return messageListCopy
    }

    const onDeleteMessage = (msg) => {
        try {
            const data = {
                action: messageActions.DELETE_MESSAGE,
                messages: [{
                    id: msg.id,
                    user_id: msg.user,
                }]
            }
            socket.current?.send(JSON.stringify(data))
        }
        catch (err) {
        }
    }

    const onMessagePress = ({ msg, measure }) => {
        setSelectedMessage(msg.id)

        const menuItems = [{
                icon: <CopyIcon {...{ color: Color.White }} />,
                text: 'Копировать',
                onPress: () => {
                    Clipboard.setString(msg.text)
                    setIsContextMenuOpen(false)
                    Toast.show("Сообщение было скопировано")
                }
            }]
        if (msg.status === messageStatus.ERROR)
            menuItems.push({
                icon: <SendIcon {...{ color: Color.White }} />,
                text: 'Отправить снова',
                onPress: () => { }
            })
        if (msg.user === userInfo.id)
            menuItems.push({
                icon: <TrashIcon {...{ color: Color.SoftRed }} />,
                text: 'Удалить',
                onPress: () => onDeleteMessage(msg),
                style: {color: Color.SoftRed}
            })

        setContextMenuItems(menuItems)
        messagesListRef.current?.measure((x, y, w, h, pX, pY) => {
            let posY = measure.pY - measure.h / 2 - pY
            if (posY + 200 > pY + h) {
                posY -= (posY + 200) - (pY + h)
            }
            setContextMenuPosition({
                x: Dimensions.get('window').width / 2 -
                    (msg.user === userInfo.id ? 0 : 100),
                y: posY
            })
            setIsContextMenuOpen(true)
        })
    }

    const onMessageListScroll = () => {
        messagesListRef.current.measure(
            (listX, listY, listWidth, listHeight, listPageX, listPageY) => {
                const unreadMessages = []
                messages.forEach(el => {
                    unreadMessages.push(...el.messages.filter(msg =>
                        msg.status === messageStatus.UNREAD &&
                        msg.user !== userInfo.id))
                })
                unreadMessages.reverse()
                for (const msg of unreadMessages) {
                    msg.ref.current?.measure((x, y, w, h, pX, pY) => {
                        if (pY >= listPageY && pY + h / 2 <= listPageY + listHeight) {
                            setMessagesRead(...unreadMessages.slice(unreadMessages.findIndex(el => el.id === msg.id)))
                            return
                        }
                    })
                }
            })
    }    
    
    const onMessageListContentSizeChange = (w, h) => {
        if (h > 0 && !oldMessagesAreLoaded && messagesListRef.current) {
            messagesListRef.current?.scrollToEnd()
            setOldMessagesAreLoaded(true)
        }
    }

    const onGoBack = () => {
        navigation.goBack()
    }

    return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                {isConnectingStatus && (<View
                    style={styles.statusContainer}
                >
                    <Text
                        style={[
                            globalStyles.text,
                            styles.statusContainerText
                        ]}
                    >
                        Подключение
                    </Text>
                    <LoadingIcon
                        width={10}
                        height={10}
                        color={Color.White} />
                </View>
                )}
                <View
                    style={styles.headerContainer}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={onGoBack}
                        style={styles.headerGoBackArrow}
                    >
                        <ArrowIcon
                            color={Color.White}
                            width={15}
                            height={15}
                        />
                    </TouchableOpacity>
                    <Text
                        style={[globalStyles.text]}
                    >
                        {chatName}
                    </Text>
                </View>
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
                            onScroll={onMessageListScroll}
                            onContentSizeChange={onMessageListContentSizeChange}
                        >
                            {messages.map((el, index) => (
                                <View
                                    key={index}
                                >
                                    <MessagesDateSplitter
                                        date={el.date}
                                    />
                                    {el.messages?.map((msg, msgIndex, msgArray) => (
                                        <View
                                            ref={msg.ref}
                                            key={msgIndex}
                                            collapsable={false}
                                        >
                                            <Message
                                                userName={chatUserList?.get(msg.user)?.name}
                                                showUserName={msgIndex === 0 || msgArray[msgIndex-1].user !== msg.user}
                                                text={msg.text}
                                                date={msg.date}
                                                status={msg.status}
                                                fromThisUser={msg.user === userInfo.id}
                                                thisUserMessageStyle={globalStyles.thisUserMessage}
                                                otherUserMessageStyle={globalStyles.otherUserMessage}
                                                onPress={(measure) => onMessagePress({ msg, measure })}
                                                style={
                                                    selectedMessage === msg.id ?
                                                        styles.selectedMessage :
                                                        null
                                                }
                                            />
                                        </View>
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
                        maxLength={1024}
                        onSend={onMessageSend}

                    />
                </View>
            </KeyboardAvoidingView>
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
    headerContainer: {
        width: '100%',
        height: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 5000,
        paddingHorizontal: 10,
        paddingVertical: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    headerGoBackArrow: {
        transform: [{
            rotate: '-90deg'
        }],
        marginRight: 10,
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

export default OnlineChatRoomContainer