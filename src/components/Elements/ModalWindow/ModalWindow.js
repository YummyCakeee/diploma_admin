import React, { useEffect, useRef } from "react"
import {
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,
    Animated,
    Easing
} from "react-native"
import { Color } from "global/styles/constants"
import { CrossIcon } from "../Icons/Index"

const ModalWindow = ({
    children,
    isShowing,
    setIshowing = () => { },
    closeButton = true,
    closeOnOutterClick = true
}) => {

    const modalWindowSize = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (isShowing) {
            Animated.timing(modalWindowSize,
                {
                    toValue: 500,
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
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => closeOnOutterClick ?
                        setIshowing(false) :
                        null}
                    style={styles.container}
                >
                    <Animated.View
                        style={[
                            styles.modalContainer,
                            {
                                maxHeight: modalWindowSize,
                                maxWidth: modalWindowSize
                            }
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
                            {children}
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 5000,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        top: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    modalContainer: {
        margin: 20,
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
    closeButtonContainer: {
        alignItems: 'flex-end',
        paddingRight: 10,
        paddingTop: 10
    }
})

export default ModalWindow