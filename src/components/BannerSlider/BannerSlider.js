import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native'
import BannerItem from './BannerItem'
import { useFocusEffect } from '@react-navigation/native';

const BannerSlider = ({items, itemsPerInterval = 3, autoSlide=false, slidingInterval = 3000}) => {
    const [extendedItems, setItems] = useState([...items])
    const [scrollPositionX, setScrollPositionX] = useState(itemsPerInterval * 100)
    const [scrollWidth, setScrollWidth] = useState((items.length + itemsPerInterval * 2) * 100)
    const [itemWidth, setItemWidth] = useState(100)
    const scroll = useRef()

    const onScroll = (event) => {
        let scrollPos = event.nativeEvent.contentOffset.x
        if (scrollPos > itemWidth * (extendedItems.length - itemsPerInterval)) {
            const diff = scrollPos - itemWidth * (extendedItems.length - itemsPerInterval)
            scrollPos = diff + (itemWidth * itemsPerInterval)
            if (scroll && scroll.current) {
                scroll.current.scrollTo({
                    x: scrollPos,
                    animated: false,
                })
            }
        }
        else if (scrollPos < itemWidth * itemsPerInterval) {
            const diff = itemWidth * itemsPerInterval - scrollPos
            scrollPos = itemWidth * (extendedItems.length - itemsPerInterval) - diff
            if (scroll && scroll.current) {
                scroll.current.scrollTo({
                    x: scrollPos,
                    animated: false,
                })
            }
        }
        setScrollPositionX(scrollPos)
    }

    useFocusEffect(() => {
        let timer = -1
        if (autoSlide)
            timer = setInterval(() => {
                scrollRight()
            }, slidingInterval);
        return () => {
            clearInterval(timer)
        }
    })

    useEffect(() => {
        setItems([
            ...(items.slice(items.length-itemsPerInterval, items.length)), 
            ...items, 
            ...(items.slice(0, itemsPerInterval))])
        const width = scrollWidth / (items.length + itemsPerInterval * 2)
        setItemWidth(width)
        const scrollPos = width * itemsPerInterval
            if (scroll && scroll.current) {
                scroll.current.scrollTo({
                    x: scrollPos,
                    animated: false,
                })
                setScrollPositionX(scrollPos)
            }
    }, [items, scrollWidth, itemsPerInterval])

    const scrollRight = useCallback(() => {
        if (scroll && scroll.current) {
            const containedItems = scrollPositionX / itemWidth
            const offset = scrollPositionX - itemWidth * Math.round(containedItems)
            scroll.current.scrollTo({
                x: scrollPositionX - offset + itemWidth,
                animated: true,
            })
        }
    }, [scrollPositionX, itemWidth, scroll])

    return (
        <View 
            style={styles.sliderContainer}            
        >
            <ScrollView
                ref={scroll}
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled
                style={styles.slider}
                onScroll={onScroll}
                onContentSizeChange={(event) => setScrollWidth(event)}
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