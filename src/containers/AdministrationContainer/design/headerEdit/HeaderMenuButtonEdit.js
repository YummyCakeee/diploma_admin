import { Color } from 'global/styles/constants'
import React, { useState, useEffect, useContext } from 'react'
import { View, Text} from 'react-native'
import useDesign from '../useDesign'
import Toast from 'react-native-simple-toast'
import { styles } from '../../styles/styles'
import ColorPicker from 'components/Elements/ColorPicker/ColorPicker'
import Button from 'components/Elements/Button/Button'
import { GlobalStylesContext } from 'global/styles/GlobalStylesWrapper'

const HeaderMenuButtonEdit = ({
    isFocused
}) => {

    const [color, setColor] = useState(Color.White)
    const {
        getStylesInfo,
        setStylesInfo,
        resetStyleInfo,
        styleNames
    } = useDesign()
    const globalStyles = useContext(GlobalStylesContext)

    useEffect(() => {
        if (isFocused) {
            getStylesInfo(styleNames.headerMenuButton, onGetStylesRequestSuccess)
        }
    }, [isFocused])

    const onGetStylesRequestSuccess = (res) => {
        const stylesData = res.data.object
        const buttonColorRes = stylesData.backgroundColor
        if (buttonColorRes)
            setColor(buttonColorRes)
    }

    const onSetStylesRequestSuccess = (res) => {
        Toast.show("Стили для шапки обновлены")
    }

    const onSaveStyles = () => {
        const styles = {
            backgroundColor: color
        }
        setStylesInfo(styleNames.headerMenuButton, styles, onSetStylesRequestSuccess)
    }

    const onResetStyle = () => {
        resetStyleInfo(styleNames.headerMenuButton, onSetStylesRequestSuccess)
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
                        Цвет кнопки
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

export default HeaderMenuButtonEdit