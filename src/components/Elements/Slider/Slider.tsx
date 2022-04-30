import globalStyles from "global/styles/styles";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, LayoutChangeEvent } from 'react-native'

type sliderProps = {
    items?: itemType[],
    onItemSelected: (item: itemType) => void,
    horizontal: boolean,
}

type itemType = {
    text: string,
    tag: any,
}

type scrollSizeType = {
    width: number,
    height: number
}

const Slider: React.FC<sliderProps> = ({
    items,
    onItemSelected = (item) => { },
    horizontal = false
}) => {
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0)
    const scrollRef = useRef<ScrollView>(null)
    const [scrollFullSize, setScrollFullSize] = useState<scrollSizeType>({width: 0, height: 0})
    const [scrollScreenSize, setScrollScreenSize] = useState<scrollSizeType>({width: 0, height: 0})
    useEffect(() => {
        onItemPress(0)
    }, [items])

    const onItemPress = (index: number) => {
        setSelectedItemIndex(index)
        if (items?.length) {
            onItemSelected(items[index])
            if (scrollRef?.current) {
                const scrollSideSize = horizontal ?
                    scrollFullSize.width :
                    scrollFullSize.height
                const itemSize = scrollSideSize / items.length
                horizontal ?
                    scrollRef.current.scrollTo(
                        { x: itemSize * index + itemSize / 2 - scrollScreenSize.width / 2 }
                    ) :
                    scrollRef.current.scrollTo(
                        { y: itemSize * index + itemSize / 2 - scrollScreenSize.height / 2}
                    )
            }
        }
    }

    const onScrollContentSizeChange = (width: number, height: number) => {
        setScrollFullSize({ width, height })
    }

    const onScrollLayout = (event: LayoutChangeEvent) => {
        const  {width, height} = event.nativeEvent.layout 
        setScrollScreenSize({width, height})
    }

    return (
        <View
            style={[
                styles.container,
                horizontal ?
                    styles.containerHorizontal :
                    styles.containerVertical
            ]}
        >
            <View
                style={styles.sliderContainer}
            >
                <ScrollView
                    ref={scrollRef}
                    horizontal={horizontal}
                    nestedScrollEnabled
                    showsHorizontalScrollIndicator={false}
                    onContentSizeChange={onScrollContentSizeChange}
                    onLayout={onScrollLayout}
                >
                    {items?.map((elem, index) => (
                        <View
                            style={[
                                styles.sliderItem,
                                horizontal ?
                                    styles.sliderItemHorizontal :
                                    styles.sliderItemVertical
                            ]}
                            key={index}
                        >
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => onItemPress(index)}
                            >
                                <Text
                                    style={[
                                        globalStyles.text,
                                        index === selectedItemIndex ?
                                            styles.sliderItemSelectedText :
                                            styles.sliderItemText
                                    ]}
                                >
                                    {elem.text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
    },
    containerHorizontal: {
        flexDirection: "row",
    },
    containerVertical: {
        flexDirection: "column",
    },
    sliderContainer: {
    },
    sliderItem: {
    },
    sliderItemHorizontal: {
        marginHorizontal: 5,
    },
    sliderItemVertical: {
        marginVertical: 5,
    },
    sliderItemText: {
        color: 'gray',
    },
    sliderItemSelectedText: {
        color: 'white',
    }
})


export default Slider