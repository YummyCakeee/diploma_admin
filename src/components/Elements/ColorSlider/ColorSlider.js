import React from "react"
import { StyleSheet, View } from 'react-native'
import LinearGradient from "react-native-linear-gradient"
import Slider from "@react-native-community/slider"
import { Color } from "global/styles/constants"

const ColorSlider = ({
    value = 0,
    onValueChange = () => { },
    colors = [
        '#ffffff',
        '#ffffff'
    ],
    style = {},
    ...props
}) => {
    return (
        <View
            style={[
                styles.container,
                style
            ]}
        >
            <LinearGradient
                colors={colors}
                start={{x: 0, y: 0}}
                end={{x:1, y: 0}}
                style={styles.gradient}
            />
            <Slider
                style={{width: '100%', height: 15}}
                onValueChange={onValueChange}
                value={value}
                minimumTrackTintColor={Color.None}
                maximumTrackTintColor={Color.None}
                {...props}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden'
    },
    gradient: {
        position: 'absolute',
        width: '100%',
        height: 15,
    }
})

export default ColorSlider