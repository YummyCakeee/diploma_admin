import React from "react"
import OnlineChatRoomContainer from "containers/OnlineChatRoomContainer"
import ScreenTemplate from "components/ScreenTemplate/ScreenTemplate"

const OnlineChatRoom = (props) => {

    return (
        <ScreenTemplate>
            <OnlineChatRoomContainer
                {...props}
            />
        </ScreenTemplate>
    )
}

export default OnlineChatRoom