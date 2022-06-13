import React, { useContext, useEffect, useState } from "react"
import { View, Text } from "react-native"
import { styles } from "containers/AdministrationContainer/styles/styles"
import InputField from "components/Elements/InputField/InputField"
import useContent from "../useContent"
import Toast from 'react-native-simple-toast'
import Button from "components/Elements/Button/Button"
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"

const HeaderEdit = ({ isFocused }) => {

    const [titleText, setTitleText] = useState('')
    const {
        getContentInfo,
        setContentInfo,
        contentNames,
    } = useContent()
    const globalStyles = useContext(GlobalStylesContext)

    useEffect(() => {
        if (isFocused)
            getContentInfo(contentNames.headerTitle, onGetContentRequestSuccess)
    }, [isFocused])

    const onGetContentRequestSuccess = (res) => {
        const contentData = res.data.object
        const headerTitleRes = contentData.text
        if (headerTitleRes)
            setTitleText(headerTitleRes)
    }

    const onSetContentRequestSuccess = (res) => {
        Toast.show("Контент шапки обновлён")
    }

    const onSaveContent = () => {
        const content = {
            text: titleText
        }
        setContentInfo(contentNames.headerTitle, content, onSetContentRequestSuccess)
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
                        Текст заголовка шапки
                    </Text>
                </View>
                <InputField
                    value={titleText}
                    onChange={setTitleText}
                />
            </View>

            <View
                style={styles.buttonContainer}
            >
                <Button
                    primary
                    title="Сохранить"
                    onPress={onSaveContent}
                />
            </View>
        </View>
    )
}

export default HeaderEdit