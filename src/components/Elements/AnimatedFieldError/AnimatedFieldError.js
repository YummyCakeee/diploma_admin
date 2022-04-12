import React, {useEffect, useState, useRef} from "react"
import { StyleSheet, Animated, Text, Easing } from "react-native"

const AnimatedFieldError = ({error = '', animatedError = true,}) => {
    const errorContainerHeight = useRef(new Animated.Value(0)).current
    const [lastError, setLastError] = useState(error)

    useEffect(() => {
        if (error){
            Animated.timing(errorContainerHeight,
                {
                    toValue: 100,
                    duration: 400,
                    easing: Easing.out(Easing.linear),
                    useNativeDriver: false,
                }).start()
            setLastError(error)
        }
        else {
            Animated.timing(errorContainerHeight,
                {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.out(Easing.linear),
                    useNativeDriver: false,
                }).start()
            setTimeout(() => {
                setLastError(error)
            }, 400);
        }
    }, [error])

    return (
        <Animated.View
            style={[styles.errorContainer, { maxHeight: errorContainerHeight }]}
        >
            <Text
                style={styles.errorText}
            >{lastError}</Text>
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    errorContainer: {
        position: 'relative',
        overflow: 'hidden',
    },
    errorText: {
        marginTop: 3,
        color: '#FF6200',
        fontSize: 14,
    }
})

export default AnimatedFieldError