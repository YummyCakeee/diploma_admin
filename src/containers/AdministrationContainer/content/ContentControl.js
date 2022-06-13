import React, { useState, Suspense } from "react"
import { View } from 'react-native'
import DropDownSection from "components/Elements/DropDownSection/DropDownSection"
import GradientLoading from "components/Elements/Loadable/GradientLoading"
import { styles } from "../styles/styles"
const HeaderEdit = React.lazy(() => import("./headerEdit/HeaderEdit"))

const MODE_NONE = 0
const MODE_EDIT_HEADER = 1

const ContentControl = () => {
    const [selectedMode, setSelectedMode] = useState(MODE_NONE)

    const onDropDownHeaderPress = (dropDownMode) => {
        if (selectedMode === dropDownMode)
            setSelectedMode(MODE_NONE)
        else setSelectedMode(dropDownMode)
    }

    return (
        <View>
            <Suspense fallback={
                <GradientLoading
                    style={styles.dropDownLoading}
                />}>
                <DropDownSection
                    title="Шапка"
                    isOpen={selectedMode === MODE_EDIT_HEADER}
                    onHeaderPress={() => onDropDownHeaderPress(MODE_EDIT_HEADER)}
                >
                    <HeaderEdit />
                </DropDownSection>
            </Suspense>
        </View>
    )
}

export default ContentControl