import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
    Animated, ScrollView, StyleSheet, Text,
    View, TouchableOpacity
} from 'react-native'
import { TriangleIcon } from '../Icons/Index'
import { withAnchorPoint } from 'react-native-anchor-point';
import LinearGradient from 'react-native-linear-gradient';
import ItemSlider, { sliderItemType, sliderItemComponentType } from '../ItemSlider/ItemSlider';

type comboboxProps = {
    data: sliderItemType[],
    headerComponent: React.FC<headerComponentType>
    itemComponent: React.FC<sliderItemComponentType>,
    splitterComponent?: React.FC,
    isEmptyChoiceOnInit: boolean,
    initialSelectedItemIndex: number,
    onItemSelected?: (item: sliderItemType) => void,
    label: string,
    style: {},
}

type headerComponentType = {
    item: sliderItemType | null
}

const Combobox: React.FC<comboboxProps> = ({
    data,
    itemComponent,
    splitterComponent,
    headerComponent,
    isEmptyChoiceOnInit = false,
    initialSelectedItemIndex = 0,
    onItemSelected = () => {},
    label = "",
    style = {}
}) => {
    const [selectedItem, setSelectedItem] = useState<sliderItemType | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const comboboxOpacity = useRef(new Animated.Value(0)).current
    const comboboxHeight = useRef(new Animated.Value(0)).current
    const triangleRotation = useRef(new Animated.Value(0)).current
    const [triangleRotationFormated, setTriangleRotationFormated] = useState<any>('0deg')

    useEffect(() => {
        if (isOpen) showCombobox()
        else hideCombobox()
    }, [isOpen])

    useEffect(() => {

    }, [isEmptyChoiceOnInit, initialSelectedItemIndex])
    
    useEffect(() => {
        setTriangleRotationFormated(
            triangleRotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-180deg']
            }))
    }, [triangleRotation])

    const onHeadPress = () => {
        if (data?.length) setIsOpen(!isOpen)
    }

    const onComboboxItemSelected = (item: sliderItemType) => {
        setSelectedItem(item)
        onItemSelected(item)
        setIsOpen(false)
    }

    const showCombobox = () => {
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

    const hideCombobox = () => {
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

    const HeaderComponent = headerComponent

    return (
        <View style={[styles.combobox, style]}>
            {label.length > 0 && (
                <Text style={styles.comboboxLabel}>
                {label}
            </Text>
            )}
            <View style={styles.comboboxContainer}>
                <TouchableOpacity
                    style={styles.selectedItemContainer}
                    onPress={onHeadPress}
                    activeOpacity={1}
                >
                    <Animated.View
                        style={
                            [
                                withAnchorPoint(
                                    { transform: [{ rotateZ: triangleRotationFormated }] },
                                    { x: 0.5, y: 0.6 },
                                    { width: 12, height: 12 }
                                ),
                                styles.comboboxTriangleContainer
                            ]
                        }>
                        <TriangleIcon
                            color="rgb(80, 80, 110)"
                            width={12}
                            height={12}
                        />
                    </Animated.View>
                    <HeaderComponent
                        item={selectedItem}
                    />
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
                        <ItemSlider 
                            {...{
                                data,
                                itemComponent,
                                splitterComponent,
                                onItemSelected: onComboboxItemSelected
                            }}
                        />
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
    selectedItemContainer: {
        color: '#fff',
        borderColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        paddingVertical: 3,
        paddingHorizontal: 5,
        width: 130,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    comboboxTriangleContainer: {
        width: 12,
        height: 12,
        marginRight: 10,
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