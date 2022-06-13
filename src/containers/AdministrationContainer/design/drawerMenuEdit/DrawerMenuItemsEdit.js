import React, { useState } from "react"
import { View } from "react-native"
import { styles } from "../../styles/styles"
import DropDownSection from "components/Elements/DropDownSection/DropDownSection"
import { Color } from "global/styles/constants"
import useDesign from "../useDesign"
import DrawerMenuItemEdit from "./DrawerMenuItemEdit"

const MODE_NONE = 0
const MODE_EDIT_SELECTED_ITEM = 1
const MODE_EDIT_ITEM = 2

const DrawerMenuItemsEdit = () => {

    const [selectedMode, setSelectedMode] = useState(MODE_NONE)

    const {
        styleNames
    } = useDesign()
    const [sections] = useState([
        { title: 'Выбранный пункт', mode: MODE_EDIT_SELECTED_ITEM, styleTag: styleNames.drawerItemSelected },
        { title: 'Невыбранные пункты', mode: MODE_EDIT_ITEM, styleTag: styleNames.drawerItem },
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
                style={styles.thirdLevelDropDownHeader}
                contentContainerStyle={{ backgroundColor: Color.None }}
            >
                <DrawerMenuItemEdit 
                    {...{
                        styleTag: el.styleTag
                    }}
                />
            </DropDownSection>
            ))}
        </View>
    )
}

export default DrawerMenuItemsEdit