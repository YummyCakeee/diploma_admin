import { Color } from "global/styles/constants"
import globalStyles from "global/styles/styles"
import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { CheckIcon } from "../Icons/Index"

type checkBoxProps = {
    checked: boolean,
    onCheckChanged: () => void,
    disabled: boolean,
    label?: string,
}

const Checkbox: React.FC<checkBoxProps> = ({
    checked = false,
    onCheckChanged = () => { },
    disabled = false,
    label,
    ...props
}) => {

    const onCheckboxPress = () => {
        if (!disabled) {
            onCheckChanged()
        }
    }

    return (
        <View
            style={styles.container}
            {...props}
        >
            <TouchableOpacity
                onPress={onCheckboxPress}
                activeOpacity={1}
                style={styles.touchableContainer}
            >
            <View
                style={[
                    styles.checkboxContainer,
                    disabled ? 
                    styles.checkboxContainerDisabled :
                    null
                ]}
            >
                {checked && (
                    <CheckIcon
                        color={Color.OceanBlue}
                        width={12}
                        height={12}
                    />
                )}
            </View>
            {label && (
                <View
                    style={styles.labelContainer}
                >
                    <Text
                        style={globalStyles.text}
                    >
                        {label}
                    </Text>
                </View>
            )}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start'
    },
    touchableContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxContainer: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 2,
        padding: 2,
        borderColor: Color.OceanBlue,
        backgroundColor: Color.White,
    },
    checkboxContainerDisabled: {
        backgroundColor: Color.LightGray
    },
    labelContainer: {
        marginLeft: 5,
    }
})

export default Checkbox