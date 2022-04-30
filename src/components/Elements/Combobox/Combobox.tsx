import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
    Animated, ScrollView, StyleSheet, Text,
    View, TouchableOpacity
} from 'react-native'
import { TriangleIcon } from '../Icons/Index'
import { withAnchorPoint } from 'react-native-anchor-point';
import LinearGradient from 'react-native-linear-gradient';

type comboboxProps = {
    items?: itemType[],
    isEmptyChoiceOnInit: boolean,
    initialSelectedItem: itemType | undefined,
    onSelectItem: (item: itemType) => void,
    label: string,
    sorted: boolean,
    onTouchStart: () => void,
    onTouchEnd: () => void,
    style: {},
}

type itemType = {
    text: string,
    tag: any
}

const Combobox: React.FC<comboboxProps> = ({
    items,
    isEmptyChoiceOnInit = false,
    initialSelectedItem = undefined,
    onSelectItem = (item) => { },
    label = "",
    sorted = false,
    style = {}
}) => {
    const [selectedItem, setSelectedItem] = useState<itemType | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const comboboxOpacity = useRef(new Animated.Value(0)).current
    const comboboxHeight = useRef(new Animated.Value(0)).current
    const triangleRotation = useRef(new Animated.Value(0)).current
    const [triangleRotationFormated, setTriangleRotationFormated] = useState<any>('0deg')

    useEffect(() => {
        if (isOpen) showcombobox()
        else hidecombobox()
    }, [isOpen])
    
    useEffect(() => {
        setTriangleRotationFormated(
            triangleRotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-180deg']
            }))
    }, [triangleRotation])

    useEffect(() => {
        if (!isEmptyChoiceOnInit)
            setSelectedItem(
                initialSelectedItem ?
                    initialSelectedItem :
                    items ? items[0] : null)
    }, [initialSelectedItem, items])

    const getSortedItems = useCallback(() => {
        if (!sorted) return items
        return items?.sort((a, b) => a.text.localeCompare(b.text))
    }, [items, sorted])

    const onHeadPress = () => {
        if (items) setIsOpen(!isOpen)
    }

    const oncomboboxItemPress = (item: itemType) => {
        if (isOpen) {
            setSelectedItem(item)
            onSelectItem(item)
            setIsOpen(false)
        }
    }

    const showcombobox = () => {
        Animated.timing(comboboxOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false
        }).start()
        Animated.timing(comboboxHeight, {
            toValue: 200,
            duration: 300,
            useNativeDriver: false
        }).start()
        Animated.timing(triangleRotation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false
        }).start()
    }

    const hidecombobox = () => {
        Animated.timing(comboboxOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start()
        Animated.timing(comboboxHeight, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false
        }).start()
        Animated.timing(triangleRotation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false
        }).start()
    }

    return (
        <View style={[styles.combobox, style]}>
            {label.length > 0 && (
                <Text style={styles.comboboxLabel}>
                {label}
            </Text>
            )}
            <View style={styles.comboboxContainer}>
                <TouchableOpacity
                    style={styles.selectedItem}
                    onPress={onHeadPress}
                    activeOpacity={1}
                >
                    <Text
                        style={styles.selectedItemText}
                        numberOfLines={1}
                    >
                        {selectedItem?.text}
                    </Text>
                    <Animated.View
                        style={
                            [withAnchorPoint(
                                { transform: [{ rotateZ: triangleRotationFormated }] },
                                { x: 0.5, y: 0.6 },
                                { width: 12, height: 12 }
                            ), styles.comboboxTriangleContainer]
                        }>
                        <TriangleIcon
                            color="rgb(80, 80, 110)"
                            width={12}
                            height={12}
                        />
                    </Animated.View>
                </TouchableOpacity>
                <Animated.View
                    style={[
                        styles.comboboxContent,
                        {
                            opacity: comboboxOpacity,
                            maxHeight: comboboxHeight,
                        }
                    ]}
                >
                    <LinearGradient
                        colors={['rgba(140, 195, 195, 0.45)', 'rgba(120, 120, 195, 0.75)']}
                        style={styles.comboboxContentGradient}
                    >
                        <ScrollView
                            nestedScrollEnabled
                            style={styles.comboboxContentScroll}
                        >
                            {getSortedItems()?.map((el, index) => (
                                <View style={styles.comboboxItem} key={index}>
                                    <Text
                                        onPress={() => oncomboboxItemPress(el)}
                                        style={styles.comboboxItemText}
                                    >
                                        {el.text}
                                    </Text>
                                    <LinearGradient
                                        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)']}
                                        style={styles.itemsSplitter}
                                        start={{ x: 0, y: 0.5 }}
                                        end={{ x: 1, y: 0.5 }}
                                    />
                                </View>
                            )
                            )}
                        </ScrollView>
                    </LinearGradient>
                </Animated.View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    combobox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginHorizontal: 5,
        marginVertical: 10,
    },
    comboboxLabel: {
        color: '#fff',
        marginRight: 30,
        fontSize: 16,
    },
    selectedItem: {
        color: '#fff',
        borderColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        paddingVertical: 3,
        paddingHorizontal: 5,
        width: 130,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedItemText: {
        fontSize: 14,
        color: "#fff",
        width: 100,
    },
    comboboxTriangle: {
    },
    comboboxTriangleContainer: {
        width: 12,
        height: 12,
    },
    comboboxContainer: {
        display: 'flex',
    },
    comboboxContent: {
        overflow: 'hidden',
        position: 'absolute',
        top: 26,
        width: 130,
        zIndex: 100,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.4)',
    },
    comboboxContentScroll: {
        maxHeight: 100,
    },
    comboboxContentGradient: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    comboboxItem: {
        paddingVertical: 3,
    },
    comboboxItemText: {
        paddingLeft: 5,
        color: '#000',
    },
    itemsSplitter: {
        width: '100%',
        height: 1,
        marginTop: 5,
    },
})

export default Combobox