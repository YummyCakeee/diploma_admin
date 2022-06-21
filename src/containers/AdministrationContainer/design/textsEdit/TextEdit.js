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
import FillLoading from 'components/Elements/Loadable/FillLoading'

const TextEdit = ({
    isFocused,
    styleTag
}) => {

    const [color, setColor] = useState(Color.White)
    const [fontSize, setFontSize] = useState('14')
    const globalStyles = useContext(GlobalStylesContext)

    const {
        getStylesInfo,
        setStylesInfo,
        resetStyleInfo,
        isLoading,
        isSubmitting
    } = useDesign()

    useEffect(() => {
        if (isFocused) {
            getStylesInfo(styleTag, onGetStylesRequestSuccess)
        }
    }, [isFocused])

    const onGetStylesRequestSuccess = (res) => {
        const stylesData = res.data.object
        const textColorRes = stylesData.color
        if (textColorRes)
            setColor(textColorRes)
        const textSizeRes = stylesData.fontSize
        if (textSizeRes)
            setFontSize(textSizeRes)
    }

    const onSetStylesRequestSuccess = (res) => {
        Toast.show("Стили для текста обновлены")
    }

    const onSaveStyles = () => {
        const styles = {
            color,
            fontSize
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
                        Цвет текста
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
                        Размер шрифта
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
                    disabled={!fontSize || isSubmitting}
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

export default TextEdit