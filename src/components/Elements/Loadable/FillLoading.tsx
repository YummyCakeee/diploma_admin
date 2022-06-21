import { Color } from "global/styles/constants"
import { getColorWithOpacity } from "global/styles/utils"
import React from "react"
import { StyleSheet, View } from 'react-native'
import { LoadingIcon } from "../Icons/Index"

const FillLoading = () => {
    
    return(
        <View
            style={styles.container}
        >
            <LoadingIcon
                color={Color.Gray}
                width={40}
                height={40}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 4000,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: getColorWithOpacity(Color.Black, 0.4)
    }
})

export default FillLoading