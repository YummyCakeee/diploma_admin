import React, { useState, useRef, useEffect, createRef } from "react";
import { StyleSheet, View, ScrollView, Animated, NativeSyntheticEvent, NativeScrollEvent, StyleProp, ViewStyle } from "react-native";
import ServiceNode from "./ServiceNode";
import LinearGradient from "react-native-linear-gradient";
import { serviceNodeType } from "./types";
import { Color } from "global/styles/constants";
import { getColorWithOpacity } from "global/styles/utils";

type servicesNodeListProps = {
    services: serviceNodeType[],
    allowNodeRemove?: boolean,
    onRemoveNodePress: (index: number) => void,
    onNodePress: (index: number) => void,
    style?: StyleProp<ViewStyle>,
}

const ServiceNodeList: React.FC<servicesNodeListProps> = ({
    services,
    allowNodeRemove = false,
    onRemoveNodePress,
    onNodePress,
    style
}) => {

    const listBottomOpacity = useRef(new Animated.Value(0)).current
    const listTopOpacity = useRef(new Animated.Value(0)).current
    const scrollRef = useRef<ScrollView>(null)
    const [nodeHeight, setNodeHeight] = useState(0)
    const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(-1)

    useEffect(() => {
        if (services?.length * nodeHeight < 300) {
            Animated.timing(
                listBottomOpacity,
                {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true
                }).start()
        }
        if (scrollRef?.current) {
            scrollRef.current.scrollToEnd()
        }
    }, [services])

    const onServicesListScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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

    const onNodePressEvent = (index: number) => {
        setSelectedNodeIndex(index)
        onNodePress(index)
    }

    return (
        <View
            style={[
                styles.chosenServicesListContainer,
                style
            ]}
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
            <LinearGradient 
                colors={[
                    'rgba(150, 150, 150, 0.0)',
                    'rgba(150, 150, 150, 1.0)',
                    'rgba(150, 150, 150, 0.0)'
                ]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.listBorder}
            />
            <ScrollView
                ref={scrollRef}
                nestedScrollEnabled
                onScroll={onServicesListScroll}
                style={styles.chosenServicesList}
            >
                {services?.map((el, index) => (
                    <ServiceNode
                        key={index}
                        {...{
                            node: el,
                            index,
                            removeButton: allowNodeRemove,
                            onRemoveNodePress,
                            onNodePress: () => onNodePressEvent(index),
                            style: index === selectedNodeIndex ? styles.selectedNode : null
                        }}
                    />
                ))}
            </ScrollView>
            <LinearGradient 
                colors={[
                    'rgba(150, 150, 150, 0.0)',
                    'rgba(150, 150, 150, 1.0)',
                    'rgba(150, 150, 150, 0.0)'
                ]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.listBorder}
            />
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
    },
    listBorder: {
        height: 1,
        width: '100%'
    },
    selectedNode: {
        backgroundColor: getColorWithOpacity(Color.Gray, 0.2)
    }
})

export default ServiceNodeList