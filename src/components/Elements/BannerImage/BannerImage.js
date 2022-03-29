import React from 'react'
import { StyleSheet, Dimensions, Image } from 'react-native'

const BannerImage = ({ source }) => {
    return (
        <Image
            source={{uri: source}}
            style={styles.bannerImage}
        />
    )
}

const styles = StyleSheet.create({
    bannerImage: {
        width: Dimensions.get('screen').width / 3 - 4,
        height: Dimensions.get('screen').width / 3 - 4,
        marginHorizontal: 2,
        backgroundColor: '#fff',
    },
})

export default BannerImage