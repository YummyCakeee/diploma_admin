import React, { useState } from "react"
import { StyleSheet, View } from 'react-native'
import DropDownSection from "components/Elements/DropDownSection/DropDownSection"
import { Color } from "global/styles/constants"
import { getColorWithOpacity } from "global/styles/utils"
import EditMaster from "./EditMaster"
import AddMaster from "./AddMaster"

const MODE_NONE = 0
const MODE_EDIT_MASTER = 1
const MODE_ADD_MASTER = 2

const MastersControl = ({ 
    masters,
    setMasters,
    services
}) => {

    const [selectedMode, setSelectedMode] = useState(MODE_NONE)
    const onDropDownHeaderPress = (dropDownMode) => {
        if (selectedMode === dropDownMode)
            setSelectedMode(MODE_NONE)
        else setSelectedMode(dropDownMode)
    }
    
    return (

        <View>
            <DropDownSection
                title="Редактирование мастера"
                isOpen={selectedMode === MODE_EDIT_MASTER}
                onHeaderPress={() => onDropDownHeaderPress(MODE_EDIT_MASTER)}
            >
                <EditMaster
                    {...{
                        masters,
                        services
                    }}
                />
            </DropDownSection>
            <DropDownSection
                title="Добавление нового мастера"
                isOpen={selectedMode === MODE_ADD_MASTER}
                onHeaderPress={() => onDropDownHeaderPress(MODE_ADD_MASTER)}
            >
                <AddMaster 
                    {...{
                        masters,
                        setMasters,
                        services
                    }}
                />
            </DropDownSection>
        </View>
    )
}

export default MastersControl