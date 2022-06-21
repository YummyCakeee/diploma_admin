import React, { useState, useEffect, useContext } from "react"
import { StyleSheet, View, Text } from "react-native"
import ScreenTemplate from "components/ScreenTemplate/ScreenTemplate"
import { ENDPOINT_CHATS } from "constants/endpoints"
import { axiosAPI2 } from "utils/axios"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import ChatRoomMinimized from "./ChatRoomMinimized"
import Loadable, { loadableStatus } from "components/Elements/Loadable/Loadable"
import { LoadingIcon, ReloadIcon } from "components/Elements/Icons/Index"
import { Color } from "global/styles/constants"
import { TouchableOpacity } from "react-native-gesture-handler"
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"

const OnlineChatRoomListContainer = () => {
    const userInfo = useSelector(userSelector)
    const [chatRooms, setChatRooms] = useState([])
    const controller = new AbortController()
    const [loadingStatus, setLoadingStatus] = useState(loadableStatus.LOADING)
    const globalStyles = useContext(GlobalStylesContext)

    useEffect(() => {
        getChatRooms()

        let updateChatsInterval = -1
        if (chatRooms.length)
            updateChatsInterval = setInterval(() => {
                getChatRooms()
            }, 5000);

        return () => {
            controller.abort()
            clearInterval(updateChatsInterval)
        }
    }, [])

    const getChatRooms = async () => {
        if (!chatRooms.length) {
            setLoadingStatus(loadableStatus.LOADING)
        }
        await axiosAPI2.get(ENDPOINT_CHATS, {
            headers: createAuthorizationHeader(userInfo.authToken),
            signal: controller.signal
        }).then(res => {
            const data = res.data
            if (data.success)
                setChatRooms(data.data?.map(el => (
                    {
                        id: el.id,
                        userId: el.user_id
                    })
                ))
            setLoadingStatus(loadableStatus.SUCCESS)
        }).catch(err => {
                setLoadingStatus(loadableStatus.FAIL)
        })
    }

    return (
            <View
                style={styles.container}
            >
                <Loadable
                    status={loadingStatus}
                    onLoadingComponent={ () =>
                        <View
                            style={styles.messagesLoadingContainer}
                        >
                            <Text
                                style={[
                                    globalStyles.text,
                                    globalStyles.centeredElement,
                                    styles.messagesLoadingText
                                ]}
                            >
                                Загрузка чатов
                            </Text>
                            <LoadingIcon
                                color={Color.Gray}
                                width={30}
                                height={30}
                            />
                        </View>
                    }
                    onFailComponent={ () =>
                        <View
                            style={styles.messagesLoadingContainer}
                        >
                            <Text
                                style={[
                                    globalStyles.text,
                                    globalStyles.centeredElement,
                                    styles.messagesLoadingText
                                ]}
                            >
                                Не удалось загрузить чаты
                            </Text>
                            <TouchableOpacity
                                onPress={getChatRooms}
                            >
                                <ReloadIcon
                                    color={Color.Gray}
                                    width={30}
                                    height={30}
                                />
                            </TouchableOpacity>
                        </View>
                    }
                >
                    {chatRooms.length ?
                        chatRooms.map(el => (
                            <ChatRoomMinimized
                                key={el.id}
                                {...el}
                            />
                        )) :
                        <View>
                            <Text
                                style={[
                                    globalStyles.text,
                                    globalStyles.centeredElement
                                ]}
                            >
                                У вас пока нет сообщений
                            </Text>
                        </View>
                    }
                </Loadable>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    messagesLoadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    messagesLoadingText: {
        marginBottom: 10,
    }
})

export default OnlineChatRoomListContainer