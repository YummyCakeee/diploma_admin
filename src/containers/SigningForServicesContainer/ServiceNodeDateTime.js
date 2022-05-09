import GradientLoading from "components/Elements/Loadable/GradientLoading"
import Loadable, { loadableStatus } from "components/Elements/Loadable/Loadable"
import Slider from "components/Elements/Slider/Slider"
import globalStyles from "global/styles/styles"
import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { dateToDayMonthYearFormatter } from "utils/formatters"

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

    useEffect(() => {
        getDates()
    }, [selectedMaster, selectedService])

    useEffect(() => {
        getTimes()
    }, [selectedDate])

    const getDates = () => {
        setDatesLoadingStatus(loadableStatus.LOADING)
        //  Получаем от сервера доступные даты для мастера
        const data = [
            '2022-05-05',
            '2022-05-07',
            '2022-05-08',
            '2022-05-10',
            '2022-05-11',
            '2022-05-12',
            '2022-05-14'
        ]
        const daysOfWeek = [
            'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'
        ]
        const date = data.map(elem => {
            const dayOfWeek = daysOfWeek[(new Date(elem)).getDay()]
            return {
                tag: elem,
                text: `${ dateToDayMonthYearFormatter(elem)} (${dayOfWeek})`
            }
        }
        )
        setDates(date)
        setDatesLoadingStatus(loadableStatus.SUCCESS)
        //~
    }

    const getTimes = () => {
        setTimesLoadingStatus(loadableStatus.LOADING)
        //  Получаем от сервера интервалы 
        const data = [
            ['9:00', '11:10'],
            ['12:00', '15:30'],
            ['16:05', '16:30'],
            ['16:50', '17:00'],
            ['18:00', '19:35']
        ]
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
                    const time = `${dateStart.getHours()}:${dateStart.getMinutes().toString().padStart(2, '0')}`
                    allowedTime.push({ tag: time, text: time })
                    dateStart.setMinutes(dateStart.getMinutes() + 5)
                }
            }

        })
        setTimes(allowedTime)
        setTimesLoadingStatus(loadableStatus.SUCCESS)
        //~
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
                    onLoadingComponent={
                        <GradientLoading
                            style={styles.timeAndDateLoading}
                        />
                    }
                    onFailComponent={
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
                    }
                >
                    <Slider
                        items={dates}
                        onItemSelected={onDateSelected}
                        horizontal
                    />
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
                    onLoadingComponent={
                        <GradientLoading
                            style={styles.timeAndDateLoading}
                        />
                    }
                    onFailComponent={
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
                    }
                >
                    <View
                        style={styles.timeListContainer}
                    >
                        <Slider
                            items={times}
                            onItemSelected={onTimeSelected}
                            horizontal
                        />
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
    }
})

export default ServiceNodeDateTime