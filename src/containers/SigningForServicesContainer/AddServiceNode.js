import globalStyles from "global/styles/styles"
import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text } from "react-native"
import Slider from "components/Elements/Slider/Slider"
import RichList from "components/Elements/RichList/RichList"
import Button from "components/Elements/Button/Button"
import ServiceNodeDateTime from "./ServiceNodeDateTime"

export const MODE_MASTER = 0
export const MODE_SERVICE = 1
export const STAGE_MODE_SELECT = 0
export const STAGE_SECOND_PARAM_SELECT = 1
export const STAGE_DATE_TIME_SELECT = 2

const AddServiceNode = ({ 
    masters, 
    services,
    onAddService = () => {}
}) => {
    const [mode, setMode] = useState(MODE_MASTER)
    const [stage, setStage] = useState(STAGE_MODE_SELECT)
    const [selectedMaster, setSelectedMaster] = useState()
    const [selectedService, setSelectedService] = useState()
    const [selectedDate, setSelectedDate] = useState()
    const [selectedTime, setSelectedTime] = useState()
    const [listItems, setListItems] = useState([])
    const [listFields, setListFields] = useState([])
    const [modeTypeSliderItems, setModeTypeSliderItems] = useState([
        { text: "Мастер", tag: MODE_MASTER },
        { text: "Услуга", tag: MODE_SERVICE }
    ])

    useEffect(() => {
        if (stage === STAGE_MODE_SELECT) {
            switch (mode) {
                case MODE_MASTER:
                    setMasterListItems(masters, true)
                    break;
                case MODE_SERVICE:
                    setServicesListItems(services, true)
                    break;
            }
        }
        if (stage === STAGE_SECOND_PARAM_SELECT) {
            switch (mode) {
                case MODE_MASTER:
                    const masterServices = services.filter(elem => {
                        if (selectedMaster.services.find(item => item === elem.id))
                            return elem
                        return null
                    })
                    setServicesListItems(masterServices)
                    break;
                case MODE_SERVICE:
                    const serviceMasters = masters.filter(elem => {
                        if (selectedService.masters.find(item => item === elem.id))
                            return elem
                        return null
                    })
                    setMasterListItems(serviceMasters)
                    break;
            }
        }
    }, [mode, stage, masters, services])

    const setMasterListItems = (items, showServices = false) => {
        setListItems(items?.map(elem => (
            { text: elem.name, tag: elem }
        )))
        const fields = [{ name: 'name', title: 'Имя' }]
        if (showServices)
            fields.push({ name: 'servicesFormatted', title: 'Услуги' })
        setListFields(fields)
    }

    const setServicesListItems = (items, showMasters = false) => {
        setListItems(items?.map(elem => (
            { text: elem.name, tag: elem }
        )))
        const fields = [
            { name: 'name', title: 'Имя' },
            { name: 'description', title: 'Описание' },
            { name: 'duration', title: 'Длительность' },
            { name: 'price', title: 'Стоимость' },
        ]
        if (showMasters)
            fields.push({ name: 'mastersFormatted', title: 'Мастера' })
        setListFields(fields)
    }

    const onListItemSelected = (item) => {
        if (stage === STAGE_MODE_SELECT) {
            if (mode === MODE_MASTER) {
                setSelectedMaster(item.tag)
            }
            else {
                setSelectedService(item.tag)
            }
        }
        else if (stage === STAGE_SECOND_PARAM_SELECT) {
            mode === MODE_MASTER ?
                setSelectedService(item.tag) :
                setSelectedMaster(item.tag)
        }
    }

    const onDateSelected = (item) => {
        setSelectedDate(item.tag)
    }

    const onTimeSelected = (item) => {
        setSelectedTime(item.tag)
    }

    const onNextStageButtonPress = () => {
        if (stage < STAGE_DATE_TIME_SELECT)
            setStage(stage + 1)
        else {
            const serviceInfo = {
                master: selectedMaster,
                service: selectedService,
                date: selectedDate,
                time: selectedTime
            }
            onAddService(serviceInfo)
            setStage(STAGE_MODE_SELECT)
        }
    }

    const onPrevStageButtonPress = () => {
        if (stage > STAGE_MODE_SELECT)
            setStage(stage - 1)
    }

    return (
        <View
            style={styles.container}
        >
            <Text
                style={[
                    globalStyles.text,
                    globalStyles.centeredElement
                ]}
            >
                {stage === STAGE_MODE_SELECT ?
                    `Выберите мастера или услугу:` :
                    stage === STAGE_SECOND_PARAM_SELECT ?
                        mode === MODE_MASTER ?
                            `Выберите услугу` :
                            `Выберите мастера` :
                        `Выберите удобную дату и время`
                }
            </Text>
            <View
                style={styles.horizontalSection}
            >
                {stage === STAGE_MODE_SELECT && (
                    <Slider
                        items={modeTypeSliderItems}
                        onItemSelected={(item) => setMode(item.tag)}
                        horizontal
                    />
                )}
                {stage >= STAGE_SECOND_PARAM_SELECT && (
                    <Text
                        style={globalStyles.text}
                    >
                        {mode === MODE_MASTER ?
                            `Мастер: ${selectedMaster.name}` :
                            `Услуга: ${selectedService.name}`}
                    </Text>
                )}
                {stage >= STAGE_DATE_TIME_SELECT && (
                    <Text
                        style={globalStyles.text}
                    >
                        {mode === MODE_MASTER ?
                            `Услуга: ${selectedService.name}` :
                            `Мастер: ${selectedMaster.name}`}
                    </Text>
                )}

            </View>
            {stage < STAGE_DATE_TIME_SELECT && (
                <RichList
                    items={listItems}
                    fields={listFields}
                    onItemSelected={onListItemSelected}
                />
            )}
            {stage === STAGE_DATE_TIME_SELECT && (
                <ServiceNodeDateTime
                {...{
                    selectedMaster,
                    selectedService,
                    selectedDate,
                    onDateSelected,
                    onTimeSelected
                }}
                />
            )}
            {stage > STAGE_MODE_SELECT && (
                <Text
                    style={globalStyles.text}
                    onPress={onPrevStageButtonPress}
                >
                    Назад
                </Text>
            )}
            <Button
                title={stage === STAGE_DATE_TIME_SELECT ?
                    "Добавить услугу" :
                    "Далее"
                }
                size={stage === STAGE_DATE_TIME_SELECT ? 
                    "medium" :
                    "small"
                }
                onPress={onNextStageButtonPress}
                style={globalStyles.centeredElement}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    horizontalSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
})

export default AddServiceNode