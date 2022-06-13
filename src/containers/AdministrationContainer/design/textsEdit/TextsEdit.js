import React, { useState } from "react"
import { View } from "react-native"
import { styles } from "../../styles/styles"
import DropDownSection from "components/Elements/DropDownSection/DropDownSection"
import { Color } from "global/styles/constants"
import TextEdit from "./TextEdit"
import useDesign from "../useDesign"

const MODE_NONE = 0
const MODE_EDIT_PAGE_TITLES = 1
const MODE_EDIT_TITLES = 2
const MODE_EDIT_TEXT = 3

const TextsEdit = () => {

    const [selectedMode, setSelectedMode] = useState(MODE_NONE)

    const {
        styleNames
    } = useDesign()

    const [sections] = useState([
        { title: "Заголовки страниц", mode: MODE_EDIT_PAGE_TITLES, styleTag: styleNames.pageTitle },
        { title: "Заголовки", mode: MODE_EDIT_TITLES, styleTag: styleNames.title },
        { title: "Обычный текст", mode: MODE_EDIT_TEXT, styleTag: styleNames.text }
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
                    <TextEdit 
                        {...{
                            styleTag: el.styleTag
                        }}
                    />
                </DropDownSection>
            ))}
        </View>
    )
}

export default TextsEdit