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
        isSubmitting,
        isLoading,
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
        Toast.show("Стили для заголовка шапки обновлены")
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
                        Цвет заголовка
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

export default HeaderTitleEdit