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
                        setMasters,
                        services
                    }}
                />
            </DropDownSection>
        </View>
    )
}

const styles = StyleSheet.create({
    horizontalSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sliderContainer: {
        height: 200,
        width: 170,
        paddingHorizontal: 5,
        borderColor: Color.Gray,
        backgroundColor: getColorWithOpacity(Color.Gray, 0.1),
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    sliderItem: {
        display: 'flex',
        flexDirection: 'row'
    },
    sliderItemText: {
        color: Color.Gray
    },
    sliderItemSelected: {
        color: Color.White
    },
    sliderItemSplitter: {
        width: '100%',
        height: 1,
        backgroundColor: Color.White
    },
    button: {

    },
    selectedMasterText: {
        color: Color.Gray,
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom: 3,
    },
    selectedServiceText: {
        color: Color.Gray,
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom: 3,
    },
    arrowIcon: {
        width: 20,
        height: 20,
        transform: [{
            rotate: '90deg'
        }],
        marginTop: 30,
    }
})

export default MastersControl