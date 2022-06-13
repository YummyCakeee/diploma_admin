import Button from "components/Elements/Button/Button"
import { Color } from "global/styles/constants"
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"
import React, { useContext } from "react"
import { StyleSheet, Text, View } from "react-native"

const ConfirmActionModal = ({
    text,
    onConfirm = () => {},
    onDismiss = () => {}
}) => {
    const globalStyles = useContext(GlobalStylesContext)
    return (
        <>
            <Text
                style={[
                    globalStyles.text,
                    globalStyles.centeredElement,
                    styles.text
                ]}
            >
                {text}
            </Text>
            <View
                style={styles.buttonsContainer}
            >
                <Button
                    primary
                    title="Да"
                    size="small"
                    onPress={onConfirm}
                />
                <Button
                    primary
                    title="Нет"
                    size="small"
                    onPress={onDismiss}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    buttonsContainer: {
        marginVertical: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    textContainer: {

    },
    text: {
        color: Color.Black,
        textAlign: 'center',
        marginVertical: 10,
    }
})

export default ConfirmActionModal