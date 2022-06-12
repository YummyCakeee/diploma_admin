import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { numberFormatter } from "utils/formatters"
import ColorPicker from "components/Elements/ColorPicker/ColorPicker"
import Button from "components/Elements/Button/Button"
import InputField from "components/Elements/InputField/InputField"
import globalStyles from "global/styles/styles"
import { styles } from "../styles"
import useDesign from "../useDesign"
import Toast from 'react-native-simple-toast'
import { Color } from "global/styles/constants"

const ButtonEdit = ({
    isFocused,
    styleTag,
}) => {

    const {
        getStylesInfo,
        setStylesInfo,
        resetStyleInfo,
    } = useDesign()

    const [buttonColor, setButtonColor] = useState(Color.White)
    const [buttonTextColor, setButtonTextColor] = useState(Color.White)
    const [buttonTextSize, setButtonTextSize] = useState('14')

    useEffect(() => {
        if (isFocused) {
            getStylesInfo(styleTag, onGetStylesRequestSuccess)
        }
    }, [isFocused])

    const onGetStylesRequestSuccess = (res) => {
        const stylesData = res.data.object
        const buttonColorRes = stylesData.backgroundColor
        if (buttonColorRes)
            setButtonColor(buttonColorRes)
        const buttonTextColorRes = stylesData.color
        if (buttonTextColorRes)
            setButtonTextColor(buttonTextColorRes)
        const buttonTextSizeRes = stylesData.fontSize
        if (buttonTextSizeRes)
            setButtonTextSize(buttonTextSizeRes)
    }

    const onSetStylesRequestSuccess = (res) => {
        Toast.show("Стили для кнопки обновлены")
    }

    const onSaveStyles = () => {
        const styles = {
                backgroundColor: buttonColor,
                color: buttonTextColor,
                fontSize: buttonTextSize,
        }
        setStylesInfo(styleTag, styles, onSetStylesRequestSuccess)
    }

    const onResetStyle = () => {
        resetStyleInfo(styleTag, onSetStylesRequestSuccess)
    }

    return (
        <>
            <View
                style={styles.section}
            >
                <View
                    style={styles.sectionName}
                >
                    <Text
                        style={globalStyles.text}
                    >
                        Размер шрифта на кнопке
                    </Text>
                </View>
                <InputField
                    {...{
                        value: buttonTextSize,
                        onChange: setButtonTextSize,
                        style: { width: 60 },
                        mask: numberFormatter
                    }}
                />
            </View>

            <View
                style={styles.section}
            >
                <View
                    style={styles.sectionName}
                >
                    <Text
                        style={globalStyles.text}
                    >
                        Цвет шрифта на кнопке
                    </Text>
                </View>
                <ColorPicker
                    {...{
                        color: buttonTextColor,
                        setColor: setButtonTextColor
                    }}
                />
            </View>

            <View
                style={styles.section}
            >
                <View
                    style={styles.sectionName}
                >
                    <Text
                        style={globalStyles.text}
                    >
                        Цвет кнопки
                    </Text>
                </View>
                <ColorPicker
                    {...{
                        color: buttonColor,
                        setColor: setButtonColor
                    }}
                />
            </View>

            <View
                style={styles.buttonContainer}
            >
                <Button
                    primary
                    title="Сохранить"
                    onPress={onSaveStyles}
                />
                <Button
                    title="Сбросить стиль"
                    onPress={onResetStyle}
                />
            </View>
        </>
    )
}

export default ButtonEdit