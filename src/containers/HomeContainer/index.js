import React, { useContext } from "react"
import { StyleSheet, Text, View } from "react-native"
import HomeSection from "./HomeSection"
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"
import { ArrowIcon } from "components/Elements/Icons/Index"
import { Color } from "global/styles/constants"

const HomeContainer = () => {
    const globalStyles = useContext(GlobalStylesContext)

    return (
        <>
            <Text style={globalStyles.pageTitle}>Добро пожаловать</Text>
            <HomeSection>
                <View
                    style={styles.openMenuSection}
                >
                    <View
                        style={styles.arrowContainer}
                    >
                        <ArrowIcon
                            color={Color.White}
                        />
                    </View>
                    <Text
                        style={[
                            globalStyles.pageTitle,
                            globalStyles.centeredElement
                        ]}
                    >
                        Откройте боковое меню
                    </Text>
                </View>
            </HomeSection>
            <HomeSection>
                <Text
                    style={[
                        globalStyles.text,
                        globalStyles.pageTitle
                    ]}
                >
                    Чувствуйте свою власть
                </Text>
            </HomeSection>
        </>
    )
}

const styles = StyleSheet.create({
    openMenuSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowContainer: {
        transform: [{
            rotate: '-90deg'
        }],
        marginRight: 5,
        marginBottom: 5,
    }
})

export default HomeContainer