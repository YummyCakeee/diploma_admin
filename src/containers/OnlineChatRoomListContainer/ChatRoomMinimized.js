import { useNavigation } from "@react-navigation/native"
import { Screen } from "components/AppNavigation/AppNavigation"
import { USER_TYPE } from "constants/application"
import { ENDPOINT_ADMINS } from "constants/endpoints"
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"
import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import { createClientEndpoint } from "utils/apiHelpers/endpointGenerators"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { axiosAPI2 } from "utils/axios"
import Toast from 'react-native-simple-toast'

const ChatRoomMinimized = ({id = '', userId = ''}) => {

    const [chatName, setChatName] = useState(null)
    const [chatUserList, setChatUserList] = useState([])
    const navigation = useNavigation()
    const userInfo = useSelector(userSelector)
    const globalStyles = useContext(GlobalStylesContext)

    useEffect(() => {
        getChatInfo()
    }, [])

    const onRoomPress = () => {
        if (chatName && chatUserList.length)
            navigation.navigate(Screen.OnlineChatRoom, { roomId: id, chatName, chatUserList })
    }

    const getChatInfo = async () => {
            const chatUsers = []
            await axiosAPI2.get(ENDPOINT_ADMINS,
                {
                    headers: createAuthorizationHeader(userInfo.authToken)
                })
            .then(res => {
                const data = res.data
                if (data.success) {
                    chatUsers.push(...data.data)
                }
                else {
                    Toast.show("Произошла ошибка при загрузке информации о чате: " + data.data.message)
                }
            })
            .catch(err => {
                Toast.show("Произошла ошибка при загрузке информации о чате")
            })
            await axiosAPI2.get(createClientEndpoint(userId),
                {
                    headers: createAuthorizationHeader(userInfo.authToken)
                })
            .then(res => {
                const data = res.data
                if (data.success) {
                        const userName =
                            data.data.first_name ?
                                `${data.data.first_name} ${data.data.second_name}` :
                                'Пользователь'
                        setChatName(userName)
                    chatUsers.push(data.data)
                    setChatUserList(chatUsers)
                }
            })
            .catch(err => {
            })
    }

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.container}
            onPress={onRoomPress}
        >
            <Text
                style={[
                    globalStyles.text,
                    styles.chatName
                ]}
            >
                {chatName}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        borderBottomWidth: 1,
        backgroundColor: 'rgba(100, 100, 100, 0.2)',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    chatName: {
        fontSize: 18,
    }
})

export default ChatRoomMinimized