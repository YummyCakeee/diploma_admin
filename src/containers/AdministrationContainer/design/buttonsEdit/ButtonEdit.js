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
import FillLoading from "components/Elements/Loadable/FillLoading"

const ButtonEdit = ({
    isFocused,
    styleTag,
}) => {

    const {
        getStylesInfo,
        setStylesInfo,
        resetStyleInfo,
        isLoading,
        isSubmitting
    } = useDesign()

    const [buttonColor, setButtonColor] = useState(Color.White)
    const [buttonTextColor, setButtonTextColor] = useState(Color.White)
    const [buttonTextSize, setButtonTextSize] = useState('14')
    const globalStyles = useContext(GlobalStylesContext)

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
        <View
            pointerEvents={isSubmitting ? 'none' : 'auto'}
        >
            {isLoading && <FillLoading/>}
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
                    disabled={!buttonTextSize || isSubmitting}
                    primary
                    title="Сохранить"
                    onPress={onSaveStyles}
                />
                <Button
                    disabled={isSubmitting}
                    title="Сбросить стиль"
                    onPress={onResetStyle}
                />
            </View>
        </View>
    )
}

export default ButtonEdit