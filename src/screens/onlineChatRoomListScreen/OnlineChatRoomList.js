import React from "react"
import OnlineChatRoomListContainer from "containers/OnlineChatRoomListContainer"
import ScreenTemplate from "components/ScreenTemplate/ScreenTemplate"

const OnlineChatRoomList = () => {
    return (
        <ScreenTemplate
            scrollable={false}
        >
            <OnlineChatRoomListContainer />
        </ScreenTemplate>
    )
}

export default OnlineChatRoomList