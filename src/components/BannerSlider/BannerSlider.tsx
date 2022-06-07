import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ScrollView, View, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Platform } from 'react-native'
import BannerItem from './BannerItem'
import { useFocusEffect } from '@react-navigation/native';
import { current } from '@reduxjs/toolkit';

type bannerSliderProps = {
    items: React.FC[],
    itemsPerInterval: number,
    autoSlide: boolean,
    slidingInterval: number,
}

const BannerSlider: React.FC<bannerSliderProps> = ({
    items,
    itemsPerInterval = 3,
    autoSlide = false,
    slidingInterval = 3000
}) => {

    const [extendedItems, setExtendedItems] = useState<React.FC[]>([...items])
    const scrollPositionX = useRef<number>(itemsPerInterval * 100)
    const [itemWidth, setItemWidth] = useState<number>(100)
    const scroll = useRef<ScrollView>(null)

    useEffect(() => {
        setExtendedItems([
            ...items.slice(items.length - itemsPerInterval - 1),
            ...items,
            ...items.slice(0, itemsPerInterval + 1),
        ])
    }, [items, itemsPerInterval])

    useEffect(() => {
        let interval: NodeJS.Timer
        if (autoSlide){
            interval = setInterval(() => {
                scrollToRight()
            }, slidingInterval)
        }
        return () => {
            clearInterval(interval)
        }
    }, [autoSlide, slidingInterval, scrollPositionX.current])

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPos = e.nativeEvent.contentOffset.x
        const scrollContentWidth = e.nativeEvent.contentSize.width
        const itemWidth = scrollContentWidth / extendedItems.length
        setItemWidth(itemWidth)
        const itemsPosThreshold = 
            (extendedItems.length - itemsPerInterval - 1) * itemWidth

        if (Math.floor(scrollPos) > Math.floor(itemsPosThreshold)) {
            const offset = Math.floor(scrollPos - itemsPosThreshold)
            const newPosition = itemWidth * (itemsPerInterval + 1) + offset 
            scroll.current?.scrollTo({
                x: newPosition,
                animated: false
            })
        }
        else if (Math.floor(scrollPos) < Math.floor(scrollContentWidth - itemsPosThreshold)) {
            const offset = Math.floor(scrollPos - (scrollContentWidth - itemsPosThreshold))
            const newPosition = scrollContentWidth - itemWidth * (itemsPerInterval + 1) + offset
            scroll.current?.scrollTo({
                x: newPosition,
                animated: false
            })
        }
        scrollPositionX.current = scrollPos
    }
    
    const scrollToRight = ()  => {
        const newPosition = scrollPositionX.current + itemWidth
        const containedItems = newPosition / itemWidth

        scroll.current?.scrollTo({
            x: Math.round(containedItems) * itemWidth,
            animated: true
        })
    }

    return (
        <View 
            style={styles.sliderContainer}            
        >
            <ScrollView
                ref={scroll}
                snapToInterval={itemWidth}
                snapToAlignment='center'
                horizontal
                decelerationRate={0}
                showsHorizontalScrollIndicator={false}
                style={styles.slider}
                onScroll={onScroll}
            >
                {extendedItems.map((el, index) => (
                    <BannerItem
                        itemWidth={itemWidth}
                        key={index}
                        item={el}
                        scrollPositionX={scrollPositionX}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    sliderContainer: {
        marginTop: 10,
        marginBottom: 15,
    },
    slider: {
    },
})

export default BannerSlider