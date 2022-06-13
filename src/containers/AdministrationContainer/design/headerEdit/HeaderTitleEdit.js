import { Color } from 'global/styles/constants'
import React, { useState, useEffect, useContext } from 'react'
import { View, Text} from 'react-native'
import useDesign from '../useDesign'
import Toast from 'react-native-simple-toast'
import { styles } from '../../styles/styles'
import ColorPicker from 'components/Elements/ColorPicker/ColorPicker'
import Button from 'components/Elements/Button/Button'
import InputField from 'components/Elements/InputField/InputField'
import { numberFormatter } from 'utils/formatters'
import { GlobalStylesContext } from 'global/styles/GlobalStylesWrapper'

const HeaderTitleEdit = ({
    isFocused
}) => {

    const [color, setColor] = useState(Color.White)
    const [fontSize, setFontSize] = useState('14')
    const globalStyles = useContext(GlobalStylesContext)

    const {
        getStylesInfo,
        setStylesInfo,
        resetStyleInfo,
        styleNames
    } = useDesign()

    useEffect(() => {
        if (isFocused) {
            getStylesInfo(styleNames.headerTitle, onGetStylesRequestSuccess)
        }
    }, [isFocused])

    const onGetStylesRequestSuccess = (res) => {
        const stylesData = res.data.object
        const titleColorRes = stylesData.color
        if (titleColorRes)
            setColor(titleColorRes)
        const titleSizeRes = stylesData.fontSize
        if (titleSizeRes)
            setFontSize(titleSizeRes)
    }

    const onSetStylesRequestSuccess = (res) => {
        Toast.show("Стили для шапки обновлены")
    }

    const onSaveStyles = () => {
        const styles = {
            color,
            fontSize
        }
        setStylesInfo(styleNames.headerTitle, styles, onSetStylesRequestSuccess)
    }

    const onResetStyle = () => {
        resetStyleInfo(styleNames.headerTitle, onSetStylesRequestSuccess)
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
                    value={fontSize}
                    onChange={setFontSize}
                    style={{ width: 60 }}
                    mask={numberFormatter}
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

export default HeaderTitleEdit