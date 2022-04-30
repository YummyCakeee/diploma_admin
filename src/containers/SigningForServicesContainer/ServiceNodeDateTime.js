import Slider from "components/Elements/Slider/Slider"
import globalStyles from "global/styles/styles"
import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { dateSlashYearMontdDayFormatter } from "utils/formatters"

const ServiceNodeDateTime = ({
    selectedMaster,
    selectedService,
    selectedDate,
    onDateSelected,
    onTimeSelected
}) => {

    const [dates, setDates] = useState([])
    const [times, setTimes] = useState([])
    useEffect(() => {
        //  Получаем от сервера доступные даты для мастера
        const data = [
            '5.05.2022',
            '7.05.2022',
            '8.05.2022',
            '10.05.2022',
            '11.05.2022',
            '12.05.2022',
            '14.05.2022'
        ]
        const daysOfWeek = [
            'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'
        ]
        const date = data.map(elem => {
            const dayOfWeek = daysOfWeek[(new Date(dateSlashYearMontdDayFormatter(elem))).getDay()]
            return {
                tag: elem,
                text: `${elem} (${dayOfWeek})`
            }
        }
        )
        setDates(date)
        //~
    }, [selectedMaster, selectedService])

    useEffect(() => {
        //  Получаем от сервера интервалы 
        const data = [
            ['9:00', '11:10'],
            ['12:00', '15:30'],
            ['16:05', '16:30'],
            ['16:50', '17:00'],
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
        //~
    }, [selectedDate])

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
                <Slider
                    items={dates}
                    onItemSelected={onDateSelected}
                    horizontal
                />
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
                <View
                    style={styles.timeListContainer}
                >
                    <Slider
                        items={times}
                        onItemSelected={onTimeSelected}
                        horizontal
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    timeListContainer: {
        
    }
})

export default ServiceNodeDateTime