import React, { useEffect, useRef } from "react"
import {
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,
    Animated,
} from "react-native"
import { Color } from "global/styles/constants"
import { CrossIcon } from "../Icons/Index"

const ModalWindow = ({
    children,
    isShowing,
    setIshowing = () => { },
    closeButton = true,
    closeOnOutterClick = true,
    style,
}) => {

    const modalWindowSize = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (isShowing) {
            Animated.timing(modalWindowSize,
                {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false
                }).start()
        }
        else {
            Animated.timing(modalWindowSize,
                {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: false
                }).start()
        }
    }, [isShowing])

    return (
        <>
            {isShowing && (
                <>
                <TouchableOpacity 
                    activeOpacity={1}
                    onPress={() => closeOnOutterClick ?
                        setIshowing(false) :
                        null}
                    style={styles.background}
                />
                <View
                    
                    style={styles.container}
                >
                    <Animated.View
                        style={[
                            styles.modalContainer,
                            {
                                maxHeight: modalWindowSize.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '90%']
                                }),
                                maxWidth: modalWindowSize.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '90%']
                                }),
                            },
                            style
                        ]}
                    >
                        <View
                            style={styles.modalContent}
                        >
                            {closeButton && (
                                <View
                                    style={styles.closeButtonContainer}
                                >
                                    <TouchableOpacity
                                        onPress={() => setIshowing(false)}
                                    >
                                        <CrossIcon
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                            <View
                                style={styles.childrenContainer}
                            >
                                {children}
                            </View>
                        </View>
                    </Animated.View>
                </View>
                </>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",        
    },
    background: {
        position: 'absolute',
        zIndex: 5000,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    modalContainer: {
        position: "absolute",
        zIndex: 5001,
        margin: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Color.Black,
        backgroundColor: Color.White,
        overflow: "hidden",
    },
    modalContent: {
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    childrenContainer: {
        paddingHorizontal: 40
    },
    closeButtonContainer: {
        alignItems: 'flex-end',
        marginRight: 10,
    }
})

export default ModalWindow