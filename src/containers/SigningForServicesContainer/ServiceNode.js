import globalStyles from "global/styles/styles"
import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { CrossIcon } from "components/Elements/Icons/Index"

const ServiceNode = ({ node, index, onRemoveNode, }) => {
    const [serviceEndTime, setServiceEndTime] = useState('')
    useEffect(() => {
        const regex = /(\d*):(\d*)/
        const [startTimeH, startTimeM] =
            node.time
                .match(regex).slice(1)
                .map(el => Number(el))
        const [servDurationH, servDurationM] =
            node.service.duration
                .match(regex).slice(1)
                .map(el => Number(el))
        const servEndTime = new Date()
        servEndTime.setHours(startTimeH + servDurationH,
            startTimeM + servDurationM)
        
        const servEndTimeH = servEndTime.getHours()
        const servEndTimeM = servEndTime.getMinutes().toString().padStart(2, '0')
        setServiceEndTime(`${servEndTimeH}:${servEndTimeM}`)
    }, [node.service.startTime, node.service.duration])
    return (
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
                        style={globalStyles.text}
                    >
                        {index + 1}
                    </Text>
                </View>
                <View
                    style={styles.section}
                >
                    <Text
                        style={globalStyles.text}
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
                            onPress={() => onRemoveNode(index)}
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
                    style={[
                        styles.section,
                        styles.serviceDate
                    ]}
                >
                    <Text
                        style={globalStyles.text}
                    >
                        Дата: {node.date}
                    </Text>
                    <Text
                        style={globalStyles.text}
                    >
                        Время: {node.time}-{serviceEndTime}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        paddingVertical: 5,
        marginVertical: 1,
        paddingHorizontal: 10
    },
    section: {
        marginRight: 15,
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