import React, { useContext, useEffect, useState } from "react"
import { View, Text } from "react-native"
import { numberFormatter } from "utils/formatters"
import ColorPicker from "components/Elements/ColorPicker/ColorPicker"
import Button from "components/Elements/Button/Button"
import InputField from "components/Elements/InputField/InputField"
import { styles } from "../../styles/styles"
import useDesign from "../useDesign"
import Toast from 'react-native-simple-toast'
import { Color } from "global/styles/constants"
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"

const DrawerMenuItemEdit = ({
    isFocused,
    styleTag,
}) => {

    const {
        getStylesInfo,
        setStylesInfo,
        resetStyleInfo,
    } = useDesign()
    const globalStyles = useContext(GlobalStylesContext)

    const [color, setColor] = useState(Color.White)
    const [textColor, setTextColor] = useState(Color.White)
    const [textSize, setTextSize] = useState('14')

    useEffect(() => {
        if (isFocused) {
            getStylesInfo(styleTag, onGetStylesRequestSuccess)
        }
    }, [isFocused])

    const onGetStylesRequestSuccess = (res) => {
        const stylesData = res.data.object
        const colorRes = stylesData.backgroundColor
        if (colorRes)
            setColor(colorRes)
        const textColorRes = stylesData.color
        if (textColorRes)
            setTextColor(textColorRes)
        const textSizeRes = stylesData.fontSize
        if (textSizeRes)
            setTextSize(textSizeRes)
    }

    const onSetStylesRequestSuccess = (res) => {
        Toast.show("Стили для меню обновлены")
    }

    const onSaveStyles = () => {
        const styles = {
                backgroundColor: color,
                color: textColor,
                fontSize: textSize,
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
                        Цвет заднего фона
                    </Text>
                </View>
                <ColorPicker
                    {...{
                        color: color,
                        setColor: setColor
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
                        Цвет текста
                    </Text>
                </View>
                <ColorPicker
                    {...{
                        color: textColor,
                        setColor: setTextColor
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
                        Размер шрифта
                    </Text>
                </View>
                <InputField
                    {...{
                        value: textSize,
                        onChange: setTextSize,
                        style: { width: 60 },
                        mask: numberFormatter
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

export default DrawerMenuItemEdit