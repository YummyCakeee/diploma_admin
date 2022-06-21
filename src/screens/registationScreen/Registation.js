import React from "react";
import RegistationContainer from "containers/RegistationContainer"
import ScreenTemplate from "components/ScreenTemplate/ScreenTemplate";

const Registration = () => {
    return (
        <ScreenTemplate
            headerHamburgerIcon={false}
        >
            <RegistationContainer />
        </ScreenTemplate>
    )
}

export default Registration