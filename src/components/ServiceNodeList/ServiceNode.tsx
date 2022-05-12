import globalStyles from "global/styles/styles"
import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { CrossIcon } from "components/Elements/Icons/Index"
import { serviceNodeType } from "./types"
import { dateToDayMonthYearFormatter } from "utils/formatters"
import { Color } from "global/styles/constants"

type serviceNodeProps = {
    node: serviceNodeType,
    index: number,
    onNodePress?: (index: number) => void,
    onRemoveNodePress?: (index: number) => void
}

const ServiceNode: React.FC<serviceNodeProps> = ({
    node,
    index,
    onNodePress = () => { },
    onRemoveNodePress = () => { },
}) => {
    const [serviceEndTime, setServiceEndTime] = useState('')
    useEffect(() => {
        if (!node.time) return
        const regex = /(\d*):(\d*)/
        const time = node.time.match(regex)
        const duration = node.service.duration.match(regex)
        if (!time || !duration) return
        const [startTimeH, startTimeM] =
            time.slice(1)
                .map(el => Number(el))
        const [servDurationH, servDurationM] =
            duration.slice(1)
                .map(el => Number(el))
        const servEndTime = new Date()
        servEndTime.setHours(startTimeH + servDurationH,
            startTimeM + servDurationM)

        const servEndTimeH = servEndTime.getHours()
        const servEndTimeM = servEndTime.getMinutes().toString().padStart(2, '0')
        setServiceEndTime(`${servEndTimeH}:${servEndTimeM}`)
    }, [node.time, node.service.duration])
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => onNodePress(index)}
        >
            <View
                style={styles.container}
            >
                <View
                    style={styles.horizontalSection}
                >
                    <View
                        style={styles.section}
                    >
                        <Text
                            style={[
                                globalStyles.text,
                                styles.position
                            ]}
                        >
                            {index + 1}
                        </Text>
                    </View>
                    <View
                        style={styles.section}
                    >
                        <Text
                            style={[
                                globalStyles.text,
                                styles.masterName
                            ]}
                            ellipsizeMode="tail"
                            numberOfLines={1}
                        >
                            Мастер: {node.master.name}
                        </Text>
                        <Text
                            style={globalStyles.text}
                        >
                            Услуга: {node.service.name}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.section,
                            styles.removeNodeSection
                        ]}
                    >
                        <View>
                            <TouchableOpacity
                                onPress={() => onRemoveNodePress(index)}
                            >
                                <CrossIcon
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View
                    style={[
                        styles.horizontalSection,
                        styles.bottomHorizontalSection
                    ]}
                >
                    <View
                        style={[
                            styles.section,
                            styles.servicePriceSection
                        ]}
                    >
                        <Text
                            style={globalStyles.text}
                        >
                            Стоимость: {node.service.price}руб.
                        </Text>
                    </View>
                    <View
                        style={styles.section}
                    >
                        <Text
                            style={globalStyles.text}
                        >
                            Дата: {dateToDayMonthYearFormatter(node.date)}
                        </Text>
                        <Text
                            style={globalStyles.text}
                        >
                            Время: {node.time}-{serviceEndTime}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: Color.Gray,
        borderRadius: 10,
        paddingVertical: 5,
        marginVertical: 1,
        paddingHorizontal: 10
    },
    section: {
        marginRight: 15,
    },
    position: {
        color: Color.Gray
    },
    masterName: {
        maxWidth: 250,
    },
    horizontalSection: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    removeNodeSection: {
        flexGrow: 1,
        alignItems: "flex-end",
        paddingRight: 10,
    },
    servicePriceSection: {
        marginLeft: 25,
    },
    serviceDateSection: {

    },
    bottomHorizontalSection: {
        alignItems: 'flex-end'
    }
})

export default ServiceNode