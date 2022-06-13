import { useNavigation } from "@react-navigation/native"
import { Screen } from "components/AppNavigation/AppNavigation"
import { USER_TYPE } from "constants/application"
import { ENDPOINT_ADMINS } from "constants/endpoints"
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"
import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import { createClientEndpoint } from "utils/apiHelpers/endpointGenerators"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { axiosAPI2 } from "utils/axios"

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
                    if (USER_TYPE === 'client') {
                        const adminNames = data.data.map(el => (
                            el.first_name ?
                                `${el.first_name} ${el.second_name}` :
                                'Администратор'
                        )).join(', ')
                        setChatName(adminNames)
                    }
                    chatUsers.push(...data.data)
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
                    chatUsers.push(data.data)
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