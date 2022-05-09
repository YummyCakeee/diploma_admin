import React, { useEffect, useRef } from 'react'
import { StyleSheet, View, Animated, Dimensions, StyleProp, ViewStyle } from 'react-native'
import { Color } from 'global/styles/constants'
import LinearGradient from 'react-native-linear-gradient'

type gradientLoadingType = {
    style?: StyleProp<ViewStyle>
}

const GradientLoading: React.FC<gradientLoadingType> = ({
    style
}) => {

    const screenWidth = Dimensions.get('screen').width
    const gradientPos = useRef(new Animated.Value(-100)).current

    useEffect(() => {
        Animated.loop(Animated.timing(
            gradientPos, 
            {
                toValue: screenWidth,
                duration: 1000,
                useNativeDriver: false
            }
        )).start()
    }, [])

    return (
        <View
            style={[
                styles.container,
                style
            ]}
        >
            <Animated.View
                style={{ left: gradientPos }}
            >
                <LinearGradient
                    colors={[
                        'rgba(255, 255, 255, 0.0)',
                        Color.White,
                        'rgba(255, 255, 255, 0.0)'
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    locations={[
                        0.2,
                        0.5,
                        0.8
                    ]}
                    style={styles.gradient}
                />
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.LightGray,
        overflow: 'hidden',
    },
    gradient: {
        width: 100,
        height: Dimensions.get('window').height,
        opacity: 0.7
    }
})

export default GradientLoading