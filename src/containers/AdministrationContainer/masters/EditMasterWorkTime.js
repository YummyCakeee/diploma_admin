import Loadable, { loadableStatus } from 'components/Elements/Loadable/Loadable'
import { Color } from 'global/styles/constants'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { LoadingIcon, ReloadIcon } from 'components/Elements/Icons/Index'
import { TouchableOpacity } from 'react-native-gesture-handler'
import globalStyles from 'global/styles/styles'
import { axiosAPI2 } from 'utils/axios'
import { createMastersWorkTimeEndpoint } from 'utils/apiHelpers/endpointGenerators'
import { createAuthorizationHeader } from 'utils/apiHelpers/headersGenerator'
import { useSelector } from 'react-redux'
import { userSelector } from 'store/selectors/userSlice'
import ItemSlider from 'components/Elements/ItemSlider/ItemSlider'
import { dateTimeSplitter } from 'utils/splitters'
import { dateSwapYearAndMonthFormatter } from 'utils/formatters'
import { getColorWithOpacity } from 'global/styles/utils'
import SectionSeparator from 'components/Elements/SectionSeparator/SectionSeparator'
import Button from 'components/Elements/Button/Button'
import Toast from 'react-native-simple-toast'
import DateTimePicker from '@react-native-community/datetimepicker'

const EditMasterWorkTime = ({ masters, selectedMaster, workTime, setWorkTime }) => {

    const [loadingStatus, setLoadingStatus] = useState(loadableStatus.LOADING)
    const [selectedWorkTime, setSelectedWotkTime] = useState(null)
    const [selectedTimeStartH, setSelectedTimeStartH] = useState('')
    const [selectedTimeStartM, setSelectedTimeStartM] = useState('')
    const [selectedTimeEndH, setSelectedTimeEndH] = useState('')
    const [selectedTimeEndM, setSelectedTimeEndM] = useState('')
    const [initialSelectedTimePredicates, setInitialSelectedTimePredicates] = useState([null, null, null, null])
    const [isDatePickerShow, setIsDatePickerShow] = useState(false)
    const [date, setDate] = useState(new Date())
    const [hours, setHours] = useState([])
    const [minutes, setMinutes] = useState([])
    const userInfo = useSelector(userSelector)
    const controller = new AbortController()

    useEffect(() => {
        if (masters && masters[selectedMaster]) {
            setSelectedWotkTime(null)
            getMasterWorkTime(masters[selectedMaster].id)
        }
        return () => {
            controller.abort()
        }
    }, [masters, selectedMaster])

    useEffect(() => {
        const h = []
        for (let i = 0; i < 24; i++) {
            h.push(i.toString().padStart(2, '0'))
        }
        setHours(h)
        const m = []
        for (let i = 0; i < 60; i += 5) {
            m.push(i.toString().padStart(2, '0'))
        }
        setMinutes(m)
    }, [])

    const getMasterWorkTime = async (masterId) => {
        setLoadingStatus(loadableStatus.LOADING)
        await axiosAPI2.get(
            createMastersWorkTimeEndpoint(masterId),
            {
                headers: createAuthorizationHeader(userInfo.authToken),
                signal: controller.signal
            })
            .then(res => {
                const data = res.data
                if (data.success) {
                    if (!data.data) {
                        setWorkTime([])
                    }
                    else {
                        const splitTimeRegex = /(\w*):(\w*)/
                        setWorkTime(data.data?.map(el => {
                            const { date, time: start } = dateTimeSplitter(new Date(el.startDate))
                            const end = dateTimeSplitter(new Date(el.endDate)).time
                            const [startH, startM] = start.match(splitTimeRegex).slice(1)
                            const [endH, endM] = end.match(splitTimeRegex).slice(1)
                            return {
                                date: dateSwapYearAndMonthFormatter(date, '.'),
                                startH,
                                startM,
                                endH,
                                endM
                            }
                        }))
                    }
                    setLoadingStatus(loadableStatus.SUCCESS)
                }
                else {
                    Toast.show("Произошла ошибка при загрузке графика мастера: " + data.data.message)
                }
            })
            .catch(err => {
                console.log(err)
                setLoadingStatus(loadableStatus.FAIL)
            })
    }

    const onWorkTimeSelected = (value) => {
        setSelectedWotkTime(value)
        setInitialSelectedTimePredicates([
            el => el === value.startH,
            el => el === value.startM,
            el => el === value.endH,
            el => el === value.endM,
        ])
    }

    const onUpdateWorkTime = () => {
        if (Number(selectedTimeStartH) + Number(selectedTimeStartM) / 60.0 >
        Number(selectedTimeEndH) + Number(selectedTimeEndM) / 60.0) {
            Toast.show("Начало работы должно быть раньше её окончания")
            return
        }
        const updatedWorkTime = workTime.map(el => {
            if (el.date === selectedWorkTime.date)
                return {
                    ...el,
                    startH: selectedTimeStartH,
                    startM: selectedTimeStartM,
                    endH: selectedTimeEndH,
                    endM: selectedTimeEndM,
                }
            return el
        })
        setWorkTime(updatedWorkTime)
    }

    const onAddDate = () => {
        setIsDatePickerShow(true)
    }

    const onDateChange = (event, selectedDate) => {
        setIsDatePickerShow(false)
        if (event.type === 'set' && selectedDate){
            const newDate = dateSwapYearAndMonthFormatter(dateTimeSplitter(selectedDate).date, '.')
            for (day of workTime) {
                if (day.date === newDate) {
                    Toast.show("Эта дата уже есть в списке")
                    return
                }
            }
            const newDay = {
                date: newDate,
                startH: '09',
                startM: '00',
                endH: '18',
                endM: '00'
            }
            setWorkTime([...workTime, newDay])
        }
        
    }

    return (
        <View
            style={styles.container}
        >
            {isDatePickerShow &&
                <DateTimePicker
                    value={date}
                    minimumDate={date}
                    mode={"date"}
                    onChange={onDateChange}
                />
            }
            <Loadable
                status={loadingStatus}
                onLoadingComponent={WorkTimesLoading}
                onFailComponent={() => WorkTimesLoadingFail(getMasterWorkTime)}
            >
                <View
                    style={styles.horizontalSection}
                >
                    <ItemSlider
                        data={workTime}
                        itemComponent={({ isSelected, item }) => (
                            <View>
                                <Text
                                    style={[
                                        globalStyles.text,
                                        isSelected ?
                                            styles.sliderSelectedItemText :
                                            styles.sliderItemText
                                    ]}
                                >
                                    {item.date}: {item.startH}:{item.startM}-{item.endH}:{item.endM}
                                </Text>
                            </View>
                        )}
                        splitterComponent={SectionSeparator}
                        bottomComponent={() => (
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={onAddDate}
                            >
                                <Text
                                    style={[
                                        globalStyles.text,
                                        styles.sliderItemText
                                    ]}
                                >
                                    Добавить дату...
                                </Text>
                            </TouchableOpacity>
                        )}
                        onItemSelected={onWorkTimeSelected}
                        style={styles.sliderContainer}
                    />
                    <View
                        style={styles.timeSelectSection}
                    >
                        <View
                            style={styles.horizontalSection}
                        >
                            <View
                                style={styles.timeSelectContainer}
                            >
                                <Text
                                    style={globalStyles.text}
                                >
                                    Начало:
                                </Text>
                                <View
                                    style={styles.horizontalSection}
                                >
                                    <View
                                        style={styles.timeSelect}
                                    >
                                        <Text
                                            style={globalStyles.text}
                                        >
                                            ЧЧ:
                                        </Text>
                                        <ItemSlider
                                            data={hours}
                                            itemComponent={({ isSelected, item }) => (
                                                <Text
                                                    style={[
                                                        globalStyles.text,
                                                        isSelected ?
                                                            styles.sliderSelectedItemText :
                                                            styles.sliderItemText
                                                    ]}
                                                >
                                                    {item}
                                                </Text>
                                            )}
                                            onItemSelected={setSelectedTimeStartH}
                                            initialSelectedItemPredicate={initialSelectedTimePredicates[0]}
                                            style={styles.timeSliderContainer}
                                        />
                                    </View>
                                    <View
                                        style={styles.timeSelect}
                                    >
                                        <Text
                                            style={globalStyles.text}
                                        >
                                            ММ:
                                        </Text>
                                        <ItemSlider
                                            data={minutes}
                                            itemComponent={({ isSelected, item }) => (
                                                <Text
                                                    style={[
                                                        globalStyles.text,
                                                        isSelected ?
                                                            styles.sliderSelectedItemText :
                                                            styles.sliderItemText
                                                    ]}
                                                >
                                                    {item}
                                                </Text>
                                            )}
                                            onItemSelected={setSelectedTimeStartM}
                                            initialSelectedItemPredicate={initialSelectedTimePredicates[1]}
                                            style={styles.timeSliderContainer}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View
                                style={styles.timeSelectContainer}
                            >
                                <Text
                                    style={globalStyles.text}
                                >
                                    Окончание:
                                </Text>
                                <View
                                    style={styles.horizontalSection}
                                >
                                    <View
                                        style={styles.timeSelect}
                                    >
                                        <Text
                                            style={globalStyles.text}
                                        >
                                            ЧЧ:
                                        </Text>
                                        <ItemSlider
                                            data={hours}
                                            itemComponent={({ isSelected, item }) => (
                                                <Text
                                                    style={[
                                                        globalStyles.text,
                                                        isSelected ?
                                                            styles.sliderSelectedItemText :
                                                            styles.sliderItemText
                                                    ]}
                                                >
                                                    {item}
                                                </Text>
                                            )}
                                            onItemSelected={setSelectedTimeEndH}
                                            initialSelectedItemPredicate={initialSelectedTimePredicates[2]}
                                            style={styles.timeSliderContainer}
                                        />
                                    </View>
                                    <View
                                        style={styles.timeSelect}
                                    >
                                        <Text
                                            style={globalStyles.text}
                                        >
                                            ММ:
                                        </Text>
                                        <ItemSlider
                                            data={minutes}
                                            itemComponent={({ isSelected, item }) => (
                                                <Text
                                                    style={[
                                                        globalStyles.text,
                                                        isSelected ?
                                                            styles.sliderSelectedItemText :
                                                            styles.sliderItemText
                                                    ]}
                                                >
                                                    {item}
                                                </Text>
                                            )}
                                            onItemSelected={setSelectedTimeEndM}
                                            initialSelectedItemPredicate={initialSelectedTimePredicates[3]}
                                            style={styles.timeSliderContainer}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View
                            style={styles.updateTimeContainer}
                        >
                            <Button
                                title="Обновить время"
                                onPress={onUpdateWorkTime}
                            />
                        </View>
                    </View>
                </View>
            </Loadable>
        </View>
    )
}

const WorkTimesLoading = () => {
    return (
        <View
            style={styles.loadingContainer}
        >
            <View
                style={styles.loadingIcon}
            >
                <LoadingIcon
                    color={Color.LightGray}
                    width={30}
                    height={30}
                />
            </View>
        </View>
    )
}

const WorkTimesLoadingFail = (onReload) => {
    return (
        <View
            style={styles.loadingContainer}
        >
            <TouchableOpacity
                onPress={onReload}
                style={styles.loadingIcon}
            >
                <ReloadIcon
                    color={Color.LightGray}
                    width={30}
                    height={30}
                />
            </TouchableOpacity>
            <Text
                style={[
                    globalStyles.text,
                    styles.loadingFailText
                ]}
            >
                Не удалось загрузить{'\n'}график мастера
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    loadingContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    loadingIcon: {
        marginBottom: 10
    },
    loadingFailText: {
        textAlign: 'center'
    },
    sliderContainer: {
        height: 150,
        width: 200,
        paddingHorizontal: 5,
        borderColor: Color.Gray,
        backgroundColor: getColorWithOpacity(Color.Gray, 0.1),
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    sliderSelectedItemText: {
        color: Color.White
    },
    sliderItemText: {
        color: Color.Gray
    },
    timeSliderContainer: {
        height: 60,
        width: 30,
        borderColor: Color.Gray,
        backgroundColor: getColorWithOpacity(Color.White, 0.1),
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    timeSelectSection: {

    },
    timeSelectContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: getColorWithOpacity(Color.Gray, 0.1),
        borderRadius: 5,
        marginHorizontal: 2,
        borderWidth: 1,
        borderColor: Color.Gray
    },
    timeSelect: {
        display: 'flex',
        alignItems: 'center',
    },
    horizontalSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    updateTimeContainer: {
        marginTop: 5,
        alignSelf: 'center'
    },
})

export default EditMasterWorkTime