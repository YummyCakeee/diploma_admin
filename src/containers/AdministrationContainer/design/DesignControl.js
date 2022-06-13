import React, { useState, Suspense } from "react"
import { View } from 'react-native'
import DropDownSection from "components/Elements/DropDownSection/DropDownSection"
import GradientLoading from "components/Elements/Loadable/GradientLoading"
import { styles } from "../styles/styles"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
const HeaderEdit = React.lazy(() => import("./headerEdit/HeaderEdit"))
const BackgroundEdit = React.lazy(() => import("./backgroundEdit/BackgroundEdit"))
const TextsEdit = React.lazy(() => import("./textsEdit/TextsEdit"))
const ButtonsEdit = React.lazy(() => import("./buttonsEdit/ButtonsEdit"))
const DrawerMenuEdit = React.lazy(() => import("./drawerMenuEdit/DrawerMenuEdit"))

const MODE_NONE = 0
const MODE_EDIT_HEADER = 1
const MODE_EDIT_BACKGROUND = 2
const MODE_EDIT_TEXT = 3
const MODE_EDIT_BUTTONS = 4
const MODE_EDIT_DRAWER_MENU = 5

const DesignControl = () => {
    const [selectedMode, setSelectedMode] = useState(MODE_NONE)
    const userInfo = useSelector(userSelector)

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
            <Suspense fallback={
                <GradientLoading
                    style={styles.dropDownLoading}
                />}>
                <DropDownSection
                    title="Задний фон"
                    isOpen={selectedMode === MODE_EDIT_BACKGROUND}
                    onHeaderPress={() => onDropDownHeaderPress(MODE_EDIT_BACKGROUND)}
                >
                    <BackgroundEdit />
                </DropDownSection>
            </Suspense>
            <Suspense fallback={
                <GradientLoading
                    style={styles.dropDownLoading}
                />}>
                <DropDownSection
                    title="Текст"
                    isOpen={selectedMode === MODE_EDIT_TEXT}
                    onHeaderPress={() => onDropDownHeaderPress(MODE_EDIT_TEXT)}
                >
                    <TextsEdit />
                </DropDownSection>
            </Suspense>
            <Suspense fallback={
                <GradientLoading
                    style={styles.dropDownLoading}
                />}>
                <DropDownSection
                    title="Кнопки"
                    isOpen={selectedMode === MODE_EDIT_BUTTONS}
                    onHeaderPress={() => onDropDownHeaderPress(MODE_EDIT_BUTTONS)}
                >
                    <ButtonsEdit />
                </DropDownSection>
            </Suspense>
            <Suspense fallback={
                <GradientLoading
                    style={styles.dropDownLoading}
                />}>
                <DropDownSection
                    title="Боковое меню"
                    isOpen={selectedMode === MODE_EDIT_DRAWER_MENU}
                    onHeaderPress={() => onDropDownHeaderPress(MODE_EDIT_DRAWER_MENU)}
                >
                    <DrawerMenuEdit />
                </DropDownSection>
            </Suspense>
        </View>
    )
}

export default DesignControl