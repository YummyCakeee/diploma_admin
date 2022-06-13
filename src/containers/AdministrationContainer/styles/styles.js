import { Color } from "global/styles/constants"
import { getColorWithOpacity } from "global/styles/utils"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    section: {
        marginBottom: 10,
    },
    sectionName: {
        marginBottom: 10,
        marginLeft: 5,
    },
    buttonContainer: {
        alignSelf: 'center',
        marginVertical: 10,
    },
    secondLevelDropDownHeader: {
        backgroundColor: getColorWithOpacity(Color.Gray, 0.3),
        paddingLeft: 25,
    },
    thirdLevelDropDownHeader: {
        backgroundColor: getColorWithOpacity(Color.Gray, 0.5),
        paddingLeft: 35,
    },
    dropDownLoading: {
        height: 30,
        width: '100%',
        marginVertical: 1
    }
})