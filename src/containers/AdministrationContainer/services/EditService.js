import React, { useEffect, useState } from "react"
import { Text, View, StyleSheet } from 'react-native'
import Button from "components/Elements/Button/Button"
import { ArrowIcon } from "components/Elements/Icons/Index"
import SectionSeparator from "components/Elements/SectionSeparator/SectionSeparator"
import Slider from "components/Elements/Slider/Slider"
import FormCheckbox from "containers/Forms/FormCheckbox"
import { Color } from "global/styles/constants"
import globalStyles from "global/styles/styles"
import { Formik, Field } from "formik"
import { getColorWithOpacity } from "global/styles/utils"
import EditServiceMainData from "./EditServiceMainData"
import { priceFormatter, timeFormatter } from "utils/formatters"
import { axiosAPI2 } from "utils/axios"
import { createServiceEndpoint } from "utils/apiHelpers/endpointGenerators"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import Toast from 'react-native-simple-toast'

const EditService = ({
    services,
    masters,
    workplaces
}) => {

    const [mastersCopy, setMastersCopy] = useState([])
    const [selectedMaster, setSelectedMaster] = useState(0)
    const [selectedService, setSelectedService] = useState(0)
    const userInfo = useSelector(userSelector)

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
        return axiosAPI2.put(createServiceEndpoint(services[selectedService].id), data, 
        {
            headers: createAuthorizationHeader(userInfo.authToken)
        })
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            Toast.show("Ошибка: Не удалось обновить данные об услуге")
            console.log(err.response.data)
        })
    }

    return (
        <Formik
            enableReinitialize
            initialValues={{
                name: services[selectedService].name,
                description: services[selectedService].description,
                duration: timeFormatter(services[selectedService].duration),
                price: priceFormatter(services[selectedService].price),
                masters: mastersCopy.map(el => el.selected ? 'true' : 'false')
            }}
            validateOnMount
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
                                Услуга:{'\n'}
                                {services[selectedService] ?
                                    services[selectedService].name :
                                    '-'}
                            </Text>
                            <Slider
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
                            <Slider
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