import { useNavigation } from "@react-navigation/native"
import { Screen } from "components/AppNavigation/AppNavigation"
import { USER_TYPE } from "constants/application"
import { ENDPOINT_ADMINS, ENDPOINT_CLIENTS } from "constants/endpoints"
import { Color } from "global/styles/constants"
import globalStyles from "global/styles/styles"
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import { createClientEndpoint } from "utils/apiHelpers/endpointGenerators"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { axiosAPI2 } from "utils/axios"

const ChatRoomMinimized = ({id = '', userId = ''}) => {

    const [chatName, setChatName] = useState(null)
    const [chatUserList, setChatUserList] = useState(new Map())
    const navigation = useNavigation()
    const userInfo = useSelector(userSelector)

    const onRoomPress = () => {
        if (chatName && chatUserList.size)
            navigation.navigate(Screen.OnlineChatRoom, { roomId: id, chatName, chatUserList })
    }

    useEffect(() => {
        getChatInfo()
    }, [])

    const getChatInfo = async () => {
            const chatUsers = new Map()
            await axiosAPI2.get(ENDPOINT_ADMINS,
                {
                    headers: createAuthorizationHeader(userInfo.authToken)
                })
            .then(res => {
                const data = res.data
                if (data.success) {
                    if (USER_TYPE === 'client') {
                        const adminNames = data.data.map(el => (
                            el.first_name ?
                                `${el.first_name} ${el.second_name}` :
                                'Администратор'
                        )).join(', ')
                        setChatName(adminNames)
                    }
                    data.data.forEach(el => {
                        chatUsers.set(el.id, {
                            id: el.id,
                            name: el.first_name,
                            surname: el.second_name,
                        })
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
            await axiosAPI2.get(createClientEndpoint(userId),
                {
                    headers: createAuthorizationHeader(userInfo.authToken)
                })
            .then(res => {
                const data = res.data
                if (data.success) {
                    if (USER_TYPE === 'admin') {
                        const userName =
                            data.data.first_name ?
                                `${data.data.first_name} ${data.data.second_name}` :
                                'Пользователь'
                        setChatName(userName)
                    }
                        chatUsers.set(data.data.id, {
                            id: data.data.id,
                            name: data.data.first_name,
                            surname: data.data.second_name,
                        })
                    setChatUserList(chatUsers)
                }
            })
            .catch(err => {
                console.log(err)
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