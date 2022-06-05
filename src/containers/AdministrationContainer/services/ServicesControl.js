import DropDownSection from "components/Elements/DropDownSection/DropDownSection"
import React, { useState } from "react"
import { StyleSheet, View } from 'react-native'
import AddService from "./AddService"
import EditService from "./EditService"

const MODE_NONE = 0
const MODE_EDIT_SERVICE = 1
const MODE_ADD_SERVICE = 2

const ServicesControl = ({
    masters,
    services,
    setServices,
    workplaces
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
                title="Редактирование услуги"
                isOpen={selectedMode === MODE_EDIT_SERVICE}
                onHeaderPress={() => onDropDownHeaderPress(MODE_EDIT_SERVICE)}
            >
                <EditService 
                    {...{
                        services,
                        masters,
                        workplaces
                    }}
                />
                </DropDownSection>
            <DropDownSection 
                title="Добавление новой услуги"
                isOpen={selectedMode === MODE_ADD_SERVICE}
                onHeaderPress={() => onDropDownHeaderPress(MODE_ADD_SERVICE)}
            >
                <AddService 
                    {...{
                        masters,
                        services,
                        setServices,
                        workplaces
                    }}
                />
            </DropDownSection>
        </View>
    )
}

const styles = StyleSheet.create({
    
})

export default ServicesControl