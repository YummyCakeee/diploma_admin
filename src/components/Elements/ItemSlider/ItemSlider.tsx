import globalStyles from "global/styles/styles";
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native'

type sliderProps = {
    itemComponent: React.FC<sliderItemComponentType>,
    splitterComponent?: React.FC,
    bottomComponent?: React.FC,
    data: sliderItemType[],
    onItemSelected?: (item: sliderItemType) => void,
    initialSelectedItemPredicate?: (item: sliderItemType) => boolean,
    horizontal?: boolean,
    style?: StyleProp<ViewStyle>
}

export type sliderItemComponentType = {
    item: sliderItemType,
    isSelected: boolean,
    index: number,
}

type scrollSizeType = {
    width: number,
    height: number
}

export type sliderItemType = { [index: string]: any }

const ItemSlider: React.FC<sliderProps> = ({
    itemComponent,
    splitterComponent,
    bottomComponent,
    data,
    onItemSelected = () => { },
    initialSelectedItemPredicate,
    horizontal = false,
    style
}) => {
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0)
    const scrollRef = useRef<ScrollView>(null)
    const [scrollFullSize, setScrollFullSize] = useState<scrollSizeType>({ width: 0, height: 0 })
    const [scrollScreenSize, setScrollScreenSize] = useState<scrollSizeType>({ width: 0, height: 0 })
    useEffect(() => {
        if (data?.length) {
            if (initialSelectedItemPredicate) {
                const index = data.findIndex(initialSelectedItemPredicate)
                if (index !== -1)
                    onItemPress(index)
            }
            else onItemPress(0)
        }
    }, [data, initialSelectedItemPredicate])
    

    const onItemPress = (index: number) => {
        setSelectedItemIndex(index)
        onItemSelected(data[index])
        if (scrollRef?.current) {
            const scrollSideSize = horizontal ?
                scrollFullSize.width :
                scrollFullSize.height
            const itemSize = scrollSideSize / data.length
            horizontal ?
                scrollRef.current.scrollTo(
                    { x: itemSize * index + itemSize / 2 - scrollScreenSize.width / 2 }
                ) :
                scrollRef.current.scrollTo(
                    { y: itemSize * index + itemSize / 2 - scrollScreenSize.height / 2 }
                )
        }
    }

    const onScrollContentSizeChange = (width: number, height: number) => {
        setScrollFullSize({ width, height })
    }

    const onScrollLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout
        setScrollScreenSize({ width, height })
    }

    const ItemComponent = itemComponent
    const SplitterComponent = splitterComponent || (() => <></>)
    const BottomComponent = bottomComponent || (() => <></>)

    return (
        <View
            style={[
                styles.container,
                horizontal ?
                    styles.containerHorizontal :
                    styles.containerVertical,
                style
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
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={onScrollContentSizeChange}
                    onLayout={onScrollLayout}
                >
                    {data?.map((elem, index) => (
                        <View
                            key={index}
                        >
                            <View
                                style={[
                                    styles.sliderItem,
                                    horizontal ?
                                        styles.sliderItemHorizontal :
                                        styles.sliderItemVertical
                                ]}
                            >
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => onItemPress(index)}
                                >
                                    <ItemComponent
                                        isSelected={index === selectedItemIndex}
                                        item={elem}
                                        index={index}
                                    />
                                </TouchableOpacity>
                            </View>
                            {splitterComponent && <SplitterComponent />}
                        </View>
                    ))}
                    {bottomComponent && <BottomComponent />}
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
        alignItems: 'flex-start',
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
})


export default ItemSlider