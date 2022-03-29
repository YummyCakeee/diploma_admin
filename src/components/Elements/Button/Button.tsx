import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import globalStyles from "../../../global/styles/styles";

type buttonProps = {
    title: string,
    onPress?: () => {},
    size?: 'small' | 'medium' | 'large',
    style?: {},
    disabled?: boolean,
}

const Button: React.FC<buttonProps> = ({
    title,
    onPress = () => { },
    size = 'medium',
    disabled = false,
    style
}) => {

    const [isPressed, setIsPressed] = useState(false)
    const width =
        size === 'small' ? 100 :
            size === 'medium' ? 150 : 200
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={!disabled ? onPress : undefined}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            style={[{ width: width }, style]}
        >
            <Text
                style={[
                    globalStyles.button,
                    disabled ? globalStyles.button_blocked :
                    isPressed ? globalStyles.button_pressed : null
                ]}
            >{title}</Text>
        </TouchableOpacity>
    )
}



export default Button