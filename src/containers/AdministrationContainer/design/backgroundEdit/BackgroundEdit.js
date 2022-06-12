import { Color } from 'global/styles/constants'
import React, { useState, useEffect } from 'react'
import { View, Text} from 'react-native'
import useDesign from '../useDesign'
import Toast from 'react-native-simple-toast'
import { styles } from '../styles'
import ColorPicker from 'components/Elements/ColorPicker/ColorPicker'
import Button from 'components/Elements/Button/Button'
import globalStyles from 'global/styles/styles'

const BackgroundEdit = ({
    isFocused
}) => {

    const [color, setColor] = useState(Color.White)
    const {
        getStylesInfo,
        setStylesInfo,
        resetStyleInfo,
        styleNames
    } = useDesign()

    useEffect(() => {
        if (isFocused) {
            getStylesInfo(styleNames.background, onGetStylesRequestSuccess)
        }
    }, [isFocused])

    const onGetStylesRequestSuccess = (res) => {
        const stylesData = res.data.object
        const colorRes = stylesData.backgroundColor
        if (colorRes)
            setColor(colorRes)
    }

    const onSetStylesRequestSuccess = (res) => {
        Toast.show("Стили для заднего фона обновлены")
    }

    const onSaveStyles = () => {
        const styles = {
            backgroundColor: color
        }
        setStylesInfo(styleNames.background, styles, onSetStylesRequestSuccess)
    }

    const onResetStyle = () => {
        resetStyleInfo(styleNames.background, onSetStylesRequestSuccess)
    }

    return (
        <View>
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
                        color,
                        setColor
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
        </View>
    )

}

export default BackgroundEdit