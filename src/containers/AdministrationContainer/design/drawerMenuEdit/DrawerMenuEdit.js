import React, { useState } from "react"
import { View } from "react-native"
import { styles } from "../styles"
import DropDownSection from "components/Elements/DropDownSection/DropDownSection"
import { Color } from "global/styles/constants"
import DrawerMenuItemsEdit from "./DrawerMenuItemsEdit"
import DrawerMenuContainerEdit from "./DrawerMenuConainerEdit"

const MODE_NONE = 0
const MODE_EDIT_BACKGROUND = 1
const MODE_EDIT_ITEMS = 2

const DrawerMenuEdit = () => {

    const [selectedMode, setSelectedMode] = useState(MODE_NONE)
    const [color, setColor] = useState('#d15c5c')
    const [textColor, setTextColor] = useState(Color.White)
    const [fontSize, setFontSize] = useState('14')

    const onDropDownHeaderPress = (dropDownMode) => {
        if (selectedMode === dropDownMode)
            setSelectedMode(MODE_NONE)
        else setSelectedMode(dropDownMode)
    }

    return (
        <View>
            <DropDownSection
                title="Задний фон"
                onHeaderPress={() => onDropDownHeaderPress(MODE_EDIT_BACKGROUND)}
                isOpen={selectedMode === MODE_EDIT_BACKGROUND}
                style={styles.secondLevelDropDownHeader}
                contentContainerStyle={{ backgroundColor: Color.None }}
            >
                <DrawerMenuContainerEdit />
            </DropDownSection>
            <DropDownSection
                title="Пункты меню"
                onHeaderPress={() => onDropDownHeaderPress(MODE_EDIT_ITEMS)}
                isOpen={selectedMode === MODE_EDIT_ITEMS}
                style={styles.secondLevelDropDownHeader}
                contentContainerStyle={{ backgroundColor: Color.None }}
            >
                <DrawerMenuItemsEdit />
            </DropDownSection>
        </View>
    )
}

export default DrawerMenuEdit