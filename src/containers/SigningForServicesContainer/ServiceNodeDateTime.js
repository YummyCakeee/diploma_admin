import GradientLoading from "components/Elements/Loadable/GradientLoading"
import Loadable, { loadableStatus } from "components/Elements/Loadable/Loadable"
import Slider from "components/Elements/Slider/Slider"
import globalStyles from "global/styles/styles"
import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { dateSwapYearAndMonthFormatter } from "utils/formatters"
import { axiosAPI2 } from "utils/axios"
import {
    createMastersWorkTimeEndpoint,
    createServicesAvailableTimeEndpoint
} from "utils/apiHelpers/endpointGenerators"
import { useSelector } from "react-redux"
import Toast from 'react-native-simple-toast'
import { Color } from "global/styles/constants"

const ServiceNodeDateTime = ({
    selectedMaster,
    selectedService,
    selectedDate,
    setSelectedDate,
    setSelectedTime
}) => {

    const [dates, setDates] = useState([])
    const [times, setTimes] = useState([])
    const [datesLoadingStatus, setDatesLoadingStatus] = useState(loadableStatus.LOADING)
    const [timesLoadingStatus, setTimesLoadingStatus] = useState(loadableStatus.LOADING)
    const token = useSelector(state => state.user.authToken)

    useEffect(() => {
        getDates()
    }, [selectedMaster, selectedService])

    useEffect(() => {
        setSelectedTime(null)
        if (selectedDate)
            getTimes()
    }, [selectedDate])

    const getDates = () => {
        setDates([])
        setSelectedDate(null)
        setDatesLoadingStatus(loadableStatus.LOADING)
        axiosAPI2.get(createMastersWorkTimeEndpoint(selectedMaster.id),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
                const data = res.data.data
                if (data === null) throw { response: { data: { message: 'У мастера нет свободных дат' } } }
                const daysOfWeek = [
                    'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'
                ]
                const date = data.map(el => {
                    el = el.startDate.replace(/T[\w | \d | - | :]*/, '')
                    const dayOfWeek = daysOfWeek[(new Date(el)).getDay()]
                    return {
                        tag: el,
                        text: `${dateSwapYearAndMonthFormatter(el).replace(/^0/, '')} (${dayOfWeek})`
                    }
                })
                setDates(date)
                setDatesLoadingStatus(loadableStatus.SUCCESS)
            }).catch(err => {
                Toast.show(err.response.data.message)
            })
    }

    const getTimes = () => {
        setTimes([])
        setTimesLoadingStatus(loadableStatus.LOADING)
        axiosAPI2.get(createServicesAvailableTimeEndpoint(selectedService.id),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    master_id: selectedMaster.id,
                    start_date: selectedDate,
                    end_date: selectedDate
                }
            })
            .then(res => {
                const data = res.data.data[0].intervals
                const regex = /(\d*):(\d*)/
                const allowedTime = []
                const dateStart = new Date()
                const dateEnd = new Date()
                data.forEach(el => {
                    const [startTimeH, startTimeM] =
                        el[0].match(regex).slice(1).map(el => Number(el))
                    const [endTimeH, endTimeM] =
                        el[1].match(regex).slice(1).map(el => Number(el))
                    const [serviceTimeH, serviceTimeM] =
                        selectedService.duration
                            .match(regex).slice(1).map(el => Number(el))

                    dateStart.setHours(startTimeH, startTimeM)
                    dateEnd.setHours(endTimeH, endTimeM)

                    const serviceEndTime = new Date()
                    serviceEndTime.setHours(startTimeH + serviceTimeH,
                        startTimeM + serviceTimeM)
                    if (serviceEndTime <= dateEnd) {
                        const serviceLatestStartTime = new Date()
                        serviceLatestStartTime.setHours(endTimeH - serviceTimeH,
                            endTimeM - serviceTimeM)

                        while (dateStart <= serviceLatestStartTime) {
                            const time = `${dateStart.getHours().toString()}:${dateStart.getMinutes().toString().padStart(2, '0')}`
                            allowedTime.push({ tag: time, text: time })
                            dateStart.setMinutes(dateStart.getMinutes() + 5)
                        }
                    }
                })
                setTimes(allowedTime)
                setTimesLoadingStatus(loadableStatus.SUCCESS)
            }).catch(err => {
                Toast.show(err.response.data.message)
            })
    }

    const onDateSelected = (item) => {
        setSelectedDate(item.tag)
    }

    const onTimeSelected = (item) => {
        setSelectedTime(item.tag)
    }

    return (
        <View>
            <View>
                <Text
                    style={[
                        globalStyles.text,
                        globalStyles.centeredElement
                    ]}
                >
                    Дата:
                </Text>
                <Loadable
                    status={datesLoadingStatus}
                    onLoadingComponent={() => (
                        <GradientLoading
                            style={styles.timeAndDateLoading}
                        />
                    )}
                    onFailComponent={() => (
                        <View>
                            <TouchableOpacity
                                onPress={getDates}
                            >
                                <Text
                                    style={[
                                        globalStyles.text,
                                        globalStyles.centeredElement
                                    ]}
                                >
                                    Не удалось загрузить. Нажмите, чтобы обновить
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                >
                    {dates.length ?
                        <Slider
                            data={dates}
                            onItemSelected={onDateSelected}
                            horizontal
                            itemComponent={({ isSelected, item }) => (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        isSelected ?
                                            styles.sliderElementSelectedText :
                                            styles.sliderElementText
                                    ]}
                                >
                                    {item.text}
                                </Text>
                            )}
                        /> :
                        <Text
                            style={[
                                globalStyles.text,
                                globalStyles.centeredElement
                            ]}
                        >
                            У мастера нет свободных дат
                        </Text>
                    }
                </Loadable>
            </View>
            <View>
                <Text
                    style={[
                        globalStyles.text,
                        globalStyles.centeredElement
                    ]}
                >
                    Время:
                </Text>
                <Loadable
                    status={timesLoadingStatus}
                    onLoadingComponent={() => (
                        <GradientLoading
                            style={styles.timeAndDateLoading}
                        />
                    )}
                    onFailComponent={() => (
                        <View>
                            <TouchableOpacity
                                onPress={getTimes}
                            >
                                <Text
                                    style={[
                                        globalStyles.text,
                                        globalStyles.centeredElement
                                    ]}
                                >
                                    Не удалось загрузить. Нажмите, чтобы обновить
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                >
                    <View
                        style={styles.timeListContainer}
                    >
                        {times.length ?
                            <Slider
                                data={times}
                                onItemSelected={onTimeSelected}
                                horizontal
                                itemComponent={({ isSelected, item }) => (
                                    <Text
                                        style={[
                                            globalStyles.text,
                                            isSelected ?
                                                styles.sliderElementSelectedText :
                                                styles.sliderElementText
                                        ]}
                                    >
                                        {item.text}
                                    </Text>
                                )}
                            /> :
                            <Text
                                style={[
                                    globalStyles.text,
                                    globalStyles.centeredElement
                                ]}
                            >
                                На эту дату нет свободного времени
                            </Text>
                        }
                    </View>
                </Loadable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    timeListContainer: {

    },
    timeAndDateLoading: {
        height: 20,
        borderRadius: 20,
        opacity: 0.5,
        marginVertical: 5
    },
    sliderElementText: {
        color: Color.Gray,
    },
    sliderElementSelectedText: {
        color: Color.White,
    },
})

export default ServiceNodeDateTime