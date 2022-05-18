import { Color } from "global/styles/constants"
import globalStyles from "global/styles/styles"
import React, { useEffect, useRef, useState } from "react"
import { 
    View, 
    TouchableOpacity, 
    StyleSheet, 
    Dimensions, 
    Text,
    Animated,
    Easing,
 } from "react-native"

type contextMenuProps = {
    items: menuItemType[],
    isOpen: boolean,
    setIsOpen: (open: boolean | menuPositionType) => void,
    position: menuPositionType,
    enableBackground: boolean,
    style?: {}
}

type menuItemType = {
    icon?: React.FC,
    text: string,
    onPress: () => void
}

type menuPositionType = {
    x: number,
    y: number
}

const ContextMenu: React.FC<contextMenuProps> = ({
    items = [],
    isOpen,
    setIsOpen = () => {},
    position = {x: 0, y: 0},
    enableBackground = false,
    style
}) => {

    const menuScaleRef = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (isOpen){
            Animated.timing(menuScaleRef, 
                {
                    toValue: 1,
                    duration: 200,
                    easing: Easing.out(Easing.sin),
                    useNativeDriver: true,
                }).start()
        }
        else {
            Animated.timing(menuScaleRef, 
                {
                    toValue: 0,
                    duration: 0,
                    easing: Easing.out(Easing.circle),
                    useNativeDriver: true,
                }).start()
        }
    },[isOpen])

    return (
        <>
            {isOpen && (
                <TouchableOpacity
                    style={[
                        styles.container,
                        enableBackground ? 
                        {backgroundColor: 'rgba(0, 0, 0, 0.2)'} :
                        null,
                        style
                    ]}
                    onPress={() => setIsOpen(false)}
                    activeOpacity={1}
                >
                    <Animated.View
                        style={[
                            styles.menu,
                            {
                                left: position.x,
                                top: position.y,
                                transform: [{scale: menuScaleRef}]
                            }
                        ]}
                    >
                        {items.map((el, index) => (
                            <View
                                key={index}
                                style={styles.menuItem}
                            >
                                <View
                                    style={styles.menuItemIcon}
                                >
                                    {el.icon}
                                </View>
                                <Text
                                    style={globalStyles.text}
                                    onPress={el.onPress || null}
                                >
                                    {el.text}
                                </Text>
                            </View>
                        ))}
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
        top: 0,
    },
    menu: {
        position: "absolute",
        maxWidth: 200,
        minWidth: 150,
        minHeight: 40,
        maxHeight: 200,
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        display: "flex",
    },
    menuItem: {
        marginVertical: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    menuItemIcon: {
        marginRight: 7,
        width: 20,
    }
})

export default ContextMenu