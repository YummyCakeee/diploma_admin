import React, { useState } from "react"
import { View } from "react-native"
import { styles } from "../../styles/styles"
import DropDownSection from "components/Elements/DropDownSection/DropDownSection"
import HeaderContainerEdit from "./HeaderContainerEdit"
import { Color } from "global/styles/constants"
import HeaderMenuButtonEdit from "./HeaderMenuButtonEdit"
import HeaderTitleEdit from "./HeaderTitleEdit"

const MODE_NONE = 0
const MODE_EDIT_HEADER = 1
const MODE_EDIT_HEADER_TITLE = 2
const MODE_EDIT_HEADER_MENU_BUTTON = 3

const HeaderEdit = () => {

    const [selectedMode, setSelectedMode] = useState(MODE_NONE)

    const onDropDownHeaderPress = (dropDownMode) => {
        if (selectedMode === dropDownMode)
            setSelectedMode(MODE_NONE)
        else setSelectedMode(dropDownMode)
    }

    return (
        <View>
            <DropDownSection
                title="Контейнер шапки"
                isOpen={selectedMode === MODE_EDIT_HEADER}
                onHeaderPress={() => onDropDownHeaderPress(MODE_EDIT_HEADER)}
                style={styles.secondLevelDropDownHeader}
                contentContainerStyle={{ backgroundColor: Color.None }}
            >
                <HeaderContainerEdit />
            </DropDownSection>
            <DropDownSection
                title="Кнопка меню шапки"
                isOpen={selectedMode === MODE_EDIT_HEADER_MENU_BUTTON}
                onHeaderPress={() => onDropDownHeaderPress(MODE_EDIT_HEADER_MENU_BUTTON)}
                style={styles.secondLevelDropDownHeader}
                contentContainerStyle={{ backgroundColor: Color.None }}
            >
                <HeaderMenuButtonEdit />
            </DropDownSection>
            <DropDownSection
                title="Заголовок шапки"
                isOpen={selectedMode === MODE_EDIT_HEADER_TITLE}
                onHeaderPress={() => onDropDownHeaderPress(MODE_EDIT_HEADER_TITLE)}
                style={styles.secondLevelDropDownHeader}
                contentContainerStyle={{ backgroundColor: Color.None }}
            >
                <HeaderTitleEdit />
            </DropDownSection>
        </View>
    )
}

export default HeaderEdit