import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, ScrollView, Animated } from "react-native";
import ServiceNode from "./ServiceNode";
import LinearGradient from "react-native-linear-gradient";

const ServiceNodeList = ({services, setServices}) => {

    const listBottomOpacity = useRef(new Animated.Value(0)).current
    const listTopOpacity = useRef(new Animated.Value(0)).current
    const [nodeHeight, setNodeHeight] = useState(0)

    useEffect(() => {
        if (services.length * nodeHeight < 300) {
            Animated.timing(
                listBottomOpacity,
                {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true
                }).start()
        }
    }, [services.length])

    const onServicesListScroll = (event) => {
        const scrollHeight = event.nativeEvent.contentSize.height
        const scrollPos = event.nativeEvent.contentOffset.y
        const nodeHeight = scrollHeight / services.length
        setNodeHeight(nodeHeight)

        const topOpacity = scrollPos / (scrollHeight - 300)
        Animated.timing(
            listTopOpacity,
            {
                toValue: topOpacity,
                duration: 200,
                useNativeDriver: true
            }).start()

        const bottomOpacity = (scrollHeight - scrollPos - 300) / (scrollHeight - 300)
        Animated.timing(
            listBottomOpacity,
            {
                toValue: bottomOpacity,
                duration: 200,
                useNativeDriver: true
            }).start()
    }

    const onRemoveNode = (index) => {
        const newServices = services.filter((elem, i) => index !== i)
        setServices(newServices)
    }
    return (
        <View
            style={styles.chosenServicesListContainer}
        >
            <Animated.View
                style={{ opacity: listTopOpacity, position: "relative" }}
            >
                <LinearGradient
                    colors={[
                        'rgba(100, 100, 100, 0.8)',
                        'rgba(100, 100, 100, 0)'
                    ]}
                    style={styles.listTop}
                />
            </Animated.View>
            <ScrollView
                nestedScrollEnabled
                onScroll={onServicesListScroll}
                style={styles.chosenServicesList}
            >
                {services.map((el, index) => (
                    <ServiceNode
                        key={index}
                        {...{
                            node: el,
                            index,
                            onRemoveNode,
                        }}
                    />
                ))}
            </ScrollView>
            <Animated.View
                style={{ opacity: listBottomOpacity, position: "relative" }}
            >
                <LinearGradient
                    colors={[
                        'rgba(100, 100, 100, 0)',
                        'rgba(100, 100, 100, 0.8)'
                    ]}
                    style={styles.listBottom}
                />
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    chosenServicesListContainer: {
    },
    chosenServicesList: {
        maxHeight: 250,
        paddingHorizontal: 4,
    },
    listTop: {
        position: "absolute",
        height: 30,
        width: '100%',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    listBottom: {
        position: "absolute",
        height: 30,
        width: '100%',
        bottom: 0,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    }
})

export default ServiceNodeList