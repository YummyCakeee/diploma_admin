import React, { useRef, useEffect, useState } from 'react'
import { View, Image, StyleSheet, Dimensions } from 'react-native'

const BannerItem = ({ item, itemWidth, scrollPositionX }) => {
    const ref = useRef()
    const [imageOpacity, setImageOpacity] = useState(1.0)
    useEffect(() => {
        ref.current.measure((fx, fy, width, height, px, py) => {
            const screenWidth = Dimensions.get('screen').width;
            const screenCenter = screenWidth / 2;
            const imageCenter = px + itemWidth / 2
            const centerOffsetX = Math.min(Math.abs(screenCenter - imageCenter), screenWidth) 
            const opacity = centerOffsetX / (screenWidth * 5) 
            setImageOpacity(/*Math.max(1.0 - opacity, 0.9)*/1)
        })
    }, [scrollPositionX, itemWidth])

    return (
        <View 
            ref={ref}
            style={{ opacity: imageOpacity }}
        >
            {item}
        </View>
    )
}

export default BannerItem