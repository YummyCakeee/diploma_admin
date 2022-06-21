import React, { useContext, useEffect, useState } from "react"
import { Text, View, StyleSheet } from 'react-native'
import Button from "components/Elements/Button/Button"
import { ArrowIcon } from "components/Elements/Icons/Index"
import SectionSeparator from "components/Elements/SectionSeparator/SectionSeparator"
import ItemSlider from "components/Elements/ItemSlider/ItemSlider"
import FormCheckbox from "containers/Forms/FormCheckbox"
import { Color } from "global/styles/constants"
import { Formik, Field } from "formik"
import { getColorWithOpacity } from "global/styles/utils"
import EditServiceMainData from "./EditServiceMainData"
import { numberFormatter, timeFormatter } from "utils/formatters"
import { axiosAPI2 } from "utils/axios"
import { createServiceEndpoint } from "utils/apiHelpers/endpointGenerators"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import Toast from 'react-native-simple-toast'
import { ModalControllerContext } from "containers/ModalController"
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"

const EditService = ({
    services,
    setServices,
    masters,
    workplaces
}) => {

    const [mastersCopy, setMastersCopy] = useState([])
    const [selectedMaster, setSelectedMaster] = useState(0)
    const [selectedService, setSelectedService] = useState(0)
    const userInfo = useSelector(userSelector)
    const {
        setConfirmActionModalState
    } = useContext(ModalControllerContext)
    const globalStyles = useContext(GlobalStylesContext)

    useEffect(() => {
        setMastersCopy(masters.map(el => {
            return {
                ...el,
                services: el.services ? [...el.services] : [],
                selected: services[selectedService]?.masters?.some(master => master === el.id)
            }
        }))
    }, [services, masters, selectedService])

    const onMasterSelected = (master) => {
        setSelectedMaster(mastersCopy.findIndex(el => el.id === master.id))
    }

    const onServiceSelected = (service) => {
        setSelectedService(services.findIndex(el => el.id === service.id))
    }

    const onSubmit = async (values) => {
        const id = services[selectedService].id
        const data = {
            name: values.name,
            description: values.description,
            duration: values.duration,
            price: values.price,
            workplace_id: workplaces[0].id,
            masters: values.masters.map((el, index) => 
                el === 'true' ? masters[index].id : null
            ).filter(val => val)
        }
        return axiosAPI2.put(createServiceEndpoint(id), data, 
        {
            headers: createAuthorizationHeader(userInfo.authToken)
        })
        .then(res => {
            if (res.data.success) {
                setServices(
                    services.map(el => {
                        if (el.id !== id)
                            return el
                        else return {
                            id,
                            name: data.name,
                            description: data.description,
                            duration: data.duration,
                            price: data.price,
                            masters: data.masters,
                        }
                    })
                )
                Toast.show("Услуга успешно изменена")
            }
            else {
                Toast.show("Не удалось обновить данные об услуге: " + res.data.data.message)
            }
        })
        .catch(err => {
            Toast.show("Не удалось обновить данные об услуге: " + err)
        })
    }

    const onDeleteService = () => {
        const service = services[selectedService]
        if (service)
            setConfirmActionModalState({
                text: "Вы уверены, что хотите удалить услугу " +
                    `"${service.name}"?`,
                onConfirm: () => deleteService(service.id)
            })
    }

    const deleteService = (serviceId) => {
        axiosAPI2.delete(createServiceEndpoint(serviceId),
        {
            headers: createAuthorizationHeader(userInfo.authToken)
        })
        .then(res => {
            if (res.data.success) {
                setServices(services.filter(el => el.id !== serviceId))
                setConfirmActionModalState(false)
                Toast.show("Услуга удалена")
            }
            else {
                Toast.show("Не удалось удалить услугу: " + res.data.data.message)
            }
        })
        .catch(err => {
            Toast.show("Не удалось удалить услугу: " + err)
        })
    }

    return (
        <Formik
            enableReinitialize
            initialValues={{
                name: services[selectedService]?.name,
                description: services[selectedService]?.description,
                duration: services[selectedService]?.duration ?
                    timeFormatter(services[selectedService].duration) :
                    '',
                price: services[selectedService]?.price ?
                    numberFormatter(services[selectedService].price) :
                    '',
                masters: mastersCopy.map(el => el.selected ? 'true' : 'false')
            }}
            validateOnMount
            onSubmit={onSubmit}
        >
            {({ handleSubmit, isValid, isSubmitting }) => (
                <View
                    pointerEvents={isSubmitting ? 'none' : 'auto'}
                    style={styles.container}
                >
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
                                Услуга:{'\n'}
                                {services[selectedService] ?
                                    services[selectedService].name :
                                    '-'}
                            </Text>
                            <ItemSlider
                                data={services}
                                onItemSelected={onServiceSelected}
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
                                            {item.name}
                                        </Text>
                                    </View>
                                )}
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
                                Мастера:{'\n'}
                                {mastersCopy[selectedMaster] ?
                                    mastersCopy[selectedMaster].name + ' ' +
                                    mastersCopy[selectedMaster].surname :
                                    '-'}
                                
                            </Text>
                            <ItemSlider
                                data={mastersCopy}
                                onItemSelected={onMasterSelected}
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
                                            {`${item.name} ${item.surname}`}
                                        </Text>
                                        <Field
                                            name={`masters[${index}]`}
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
                        Обновление данных об услуге
                    </Text>
                    <EditServiceMainData />
                    <SectionSeparator />
                    <Button
                        title="Сохранить изменения"
                        size="large"
                        primary
                        disabled={isSubmitting || !isValid}
                        onPress={handleSubmit}
                        style={[
                            globalStyles.centeredElement
                        ]}
                    />
                    <Button
                        title="Удалить услугу"
                        size="large"
                        disabled={!isValid || isSubmitting}
                        onPress={onDeleteService}
                        style={[
                            globalStyles.centeredElement
                        ]}
                    />
                </View>
            )}
        </Formik>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
    },
    horizontalSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sliderContainer: {
        height: 200,
        width: 150,
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
        width: '100%',
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

export default EditService