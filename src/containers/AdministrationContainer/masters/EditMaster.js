import React, { useEffect, useState } from "react"
import { Text, View, StyleSheet } from 'react-native'
import Button from "components/Elements/Button/Button"
import { ArrowIcon } from "components/Elements/Icons/Index"
import SectionSeparator from "components/Elements/SectionSeparator/SectionSeparator"
import Slider from "components/Elements/Slider/Slider"
import FormCheckbox from "containers/Forms/FormCheckbox"
import { Color } from "global/styles/constants"
import globalStyles from "global/styles/styles"
import EditMasterPersonalData from "./EditMasterPersonalData"
import { Formik, Field } from "formik"
import { getColorWithOpacity } from "global/styles/utils"
import EditMasterWorkTime from "./EditMasterWorkTime"
import { phoneNumberFormatter } from "utils/formatters"

const EditMaster = ({masters, services}) => {

    const [servicesCopy, setServicesCopy] = useState([])
    const [selectedMaster, setSelectedMaster] = useState(0)
    const [selectedService, setSelectedService] = useState(0)
    const [workTime, setWorkTime] = useState([])

    useEffect(() => {
        setServicesCopy(services.map(el => {
            return {
                ...el,
                masters: [...el.masters],
                selected: masters[selectedMaster]?.services.some(service => service === el.id)
            }
        }))
    }, [services, masters, selectedMaster])

    const onMasterSelected = (master) => {
        setSelectedMaster(masters.findIndex(el => el.id === master.id))
    }

    const onServiceSelected = (service) => {
        setSelectedService(servicesCopy.findIndex(el => el.id === service.id))
    }

    const onSubmit = (values) => {
    }

    return (
        <Formik
            enableReinitialize
            initialValues={{
                surname: masters[selectedMaster]?.surname,
                name: masters[selectedMaster]?.name,
                patronymic: masters[selectedMaster]?.patronymic,
                phone: masters[selectedMaster]?.phone ? 
                    phoneNumberFormatter(masters[selectedMaster]?.phone) :
                    '+7',
                email: masters[selectedMaster]?.email,
                password: masters[selectedMaster]?.password,
                services: servicesCopy.map(el => el.selected ? 'true' : 'false')
            }}
            onSubmit={onSubmit}
        >
            {({ handleSubmit, isValid, isSubmitting }) => (
                <>
                    <View
                        style={styles.horizontalSection}
                    >
                        <View>
                            <Text
                                style={[
                                    globalStyles.text,
                                    styles.selectedMasterText
                                ]}
                            >
                                Мастер:{'\n'}
                                {masters[selectedMaster] ?
                                    masters[selectedMaster].name + ' ' +
                                    masters[selectedMaster].surname :
                                    '-'}
                            </Text>
                            <Slider
                                data={masters}
                                onItemSelected={onMasterSelected}
                                itemComponent={({ item, isSelected }) => (
                                    <View
                                        style={styles.sliderItem}
                                    >
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                isSelected ?
                                                    styles.sliderItemSelectedText :
                                                    styles.sliderItemText
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {`${item.name} ${item.surname}`}
                                        </Text>
                                    </View>
                                )
                                }
                                splitterComponent={SectionSeparator}
                                style={styles.sliderContainer}
                            />
                        </View>
                        <View
                            style={styles.arrowIcon}
                        >
                            <ArrowIcon
                                color={Color.Gray}
                            />
                        </View>
                        <View>
                            <Text
                                style={[
                                    globalStyles.text,
                                    styles.selectedServiceText
                                ]}
                            >
                                Услуги:{'\n'}
                                {servicesCopy[selectedService] ?
                                    servicesCopy[selectedService].name :
                                    '-'}
                            </Text>
                            <Slider
                                data={servicesCopy}
                                onItemSelected={onServiceSelected}
                                itemComponent={({ item, isSelected, index }) => (
                                    <View
                                        style={styles.sliderItem}
                                    >
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                isSelected ?
                                                    styles.sliderItemSelectedText :
                                                    styles.sliderItemText
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {item.name}
                                        </Text>
                                        <Field
                                            name={`services[${index}]`}
                                            component={FormCheckbox}
                                        />
                                    </View>
                                )}
                                splitterComponent={SectionSeparator}
                                style={styles.sliderContainer}
                            />
                        </View>
                    </View>
                    <Text
                        style={globalStyles.title}
                    >
                        Обновление личных данных
                    </Text>
                    <EditMasterPersonalData />
                    <Text
                        style={globalStyles.title}
                    >
                        График работы
                    </Text>
                    <EditMasterWorkTime 
                        {...{
                            masters,
                            selectedMaster,
                            workTime,
                            setWorkTime
                        }}
                    />
                    <SectionSeparator />
                    <Button
                        title="Сохранить изменения"
                        size="large"
                        disabled={!isValid || isSubmitting}
                        primary
                        onPress={handleSubmit}
                        style={[
                            globalStyles.centeredElement
                        ]}
                    />
                </>
            )}
        </Formik>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    horizontalSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sliderContainer: {
        height: 200,
        width: 170,
        paddingHorizontal: 5,
        borderColor: Color.Gray,
        backgroundColor: getColorWithOpacity(Color.Gray, 0.1),
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    sliderItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    sliderItemText: {
        color: Color.Gray,
        marginRight: 5,
        flexShrink: 1,
    },
    sliderItemSelectedText: {
        color: Color.White,
        marginRight: 5,
        flexShrink: 1,
    },
    button: {

    },
    selectedMasterText: {
        color: Color.Gray,
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom: 3,
    },
    selectedServiceText: {
        color: Color.Gray,
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom: 3,
    },
    arrowIcon: {
        width: 20,
        height: 20,
        transform: [{
            rotate: '90deg'
        }],
        marginTop: 30,
    }
})

export default EditMaster