import React, { useState } from "react"
import { View } from "react-native"
import { styles } from "../styles"
import DropDownSection from "components/Elements/DropDownSection/DropDownSection"
import { Color } from "global/styles/constants"
import ButtonEdit from "./ButtonEdit"
import useDesign from "../useDesign"

const MODE_NONE = 0
const MODE_EDIT_BUTTON = 1
const MODE_EDIT_MAIN_BUTTON = 2
const MODE_EDIT_PRESSED_BUTTON = 3
const MODE_EDIT_BLOCKED_BUTTON = 4

const ButtonsEdit = () => {

    const [selectedMode, setSelectedMode] = useState(MODE_NONE)

    const {
        styleNames
    } = useDesign()

    const [sections] = useState([
        { title: "Кнопка", mode: MODE_EDIT_BUTTON, styleTag: styleNames.button },
        { title: "Главная кнопка", mode: MODE_EDIT_MAIN_BUTTON, styleTag: styleNames.buttonPrimary },
        { title: "Нажатая кнопка", mode: MODE_EDIT_PRESSED_BUTTON, styleTag: styleNames.buttonPressed },
        { title: "Заблокированная кнопка", mode: MODE_EDIT_BLOCKED_BUTTON, styleTag: styleNames.buttonBlocked },
    ])

    const onDropDownHeaderPress = (dropDownMode) => {
        if (selectedMode === dropDownMode)
            setSelectedMode(MODE_NONE)
        else setSelectedMode(dropDownMode)
    }

    return (
        <View>
            {sections.map(el => (
                <DropDownSection
                    key={el.title}
                    title={el.title}
                    onHeaderPress={() => onDropDownHeaderPress(el.mode)}
                    isOpen={selectedMode === el.mode}
                    style={styles.secondLevelDropDownHeader}
                    contentContainerStyle={{ backgroundColor: Color.None }}
                >
                    <ButtonEdit
                        {...{
                            styleTag: el.styleTag,
                        }}
                    />
                </DropDownSection>
            ))}
        </View>
    )
}

export default ButtonsEdit