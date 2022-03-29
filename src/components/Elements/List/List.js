import React, { useEffect, useState, useRef } from 'react'
import {
    Animated, ScrollView, StyleSheet, Text,
    View, TouchableOpacity
} from 'react-native'
import { TriangleIcon } from '../../Elements/Icons/Index'
import { withAnchorPoint } from 'react-native-anchor-point';
import LinearGradient from 'react-native-linear-gradient';

const List = ({
    items = [],
    initialSelectedItem = "-",
    onSelect = () => { },
    label = "",
    onTouchStart = () => { },
    onTouchEnd = () => { },
}) => {
    const [selectedItem, setSelectedItem] = useState()
    const [isOpen, setIsOpen] = useState(false)
    const listOpacity = useRef(new Animated.Value(0)).current
    const listHeight = useRef(new Animated.Value(0)).current
    const triangleRotation = useRef(new Animated.Value(0)).current
    const [triangleRotationFormated, setTriangleRotationFormated] = useState('0deg')

    useEffect(() => {
        if (isOpen) showList()
        else hideList()
    }, [isOpen])

    useEffect(() => {
        setTriangleRotationFormated(
            triangleRotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-180deg']
            }))
    }, [triangleRotation])

    useEffect(() => {
        setSelectedItem(
            initialSelectedItem ? initialSelectedItem :
                items ? items[0] : null)
    }, [initialSelectedItem])

    const showList = () => {
        Animated.timing(listOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false
        }).start()
        Animated.timing(listHeight, {
            toValue: 200,
            duration: 300,
            useNativeDriver: false
        }).start()
        Animated.timing(triangleRotation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false
        }).start()
    }

    const hideList = () => {
        Animated.timing(listOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start()
        Animated.timing(listHeight, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false
        }).start()
        Animated.timing(triangleRotation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start()
    }

    const onListItemPress = (el) => {
        if (isOpen) {
            setSelectedItem(el)
            onSelect(el)
            setIsOpen(false)
        }
    }

    return (
        <View style={styles.list}>
            <Text style={styles.listLabel}>
                {label}
            </Text>
            <View style={styles.listContainer}>
                <TouchableOpacity
                    style={styles.selectedItem}
                    onPress={() => setIsOpen(!isOpen)}
                    activeOpacity={1}
                >
                    <Text style={styles.selectedItemText}>{selectedItem}</Text>
                    <Animated.View
                        style={
                            [withAnchorPoint(
                                { transform: [{ rotateZ: triangleRotationFormated }] },
                                { x: 0.5, y: 0.6 },
                                { width: 12, height: 12 }
                            ), styles.listTriangleContainer]
                        }>
                        <TriangleIcon
                            color="rgb(80, 80, 110)"
                            width={12}
                            height={12}
                            style={styles.listTriangle}
                        />
                    </Animated.View>
                </TouchableOpacity>
                <Animated.View
                    style={[
                        styles.listContent,
                        {
                            opacity: listOpacity,
                            maxHeight: listHeight,
                            // transform: [
                            //     { scaleY: listHeight },
                            // ]
                        }
                    ]}
                >
                    <LinearGradient
                        colors={['rgba(140, 195, 195, 0.25)', 'rgba(120, 120, 195, 0.55)']}
                        style={styles.listContentGradient}
                    >
                        <ScrollView
                            onTouchStart={onTouchStart}
                            onTouchCancel={onTouchEnd}
                        >
                            {items?.sort().map((el) => (
                                <View style={styles.listItem} key={el}>
                                    <Text
                                        onPress={() => onListItemPress(el)}
                                        style={styles.listItemText}
                                    >
                                        {el}
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
    list: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: 300,
        marginHorizontal: 5,
        marginVertical: 10,
    },
    listLabel: {
        color: '#fff',
        marginRight: 30,
        fontSize: 16,
    },
    selectedItem: {
        color: '#fff',
        fontSize: 16,
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
        color: "#fff",
    },
    listTriangle: {
    },
    listTriangleContainer: {
        width: 12,
        height: 12,
    },
    listContainer: {
        display: 'flex',
    },
    listContent: {
        height: 110,
        position: 'absolute',
        top: 26,
        width: 130,
        zIndex: 100,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.4)',
    },
    listContentGradient: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    listItem: {
        paddingVertical: 3,
    },
    listItemText: {
        paddingLeft: 5,
        color: '#000',
    },
    itemsSplitter: {
        width: '100%',
        height: 1,
        marginTop: 5,
    },
})

export default List