import React, { useEffect, useState } from "react"
import { Text, View, StyleSheet } from 'react-native'
import Button from "components/Elements/Button/Button"
import { ArrowIcon } from "components/Elements/Icons/Index"
import SectionSeparator from "components/Elements/SectionSeparator/SectionSeparator"
import ItemSlider from "components/Elements/ItemSlider/ItemSlider"
import FormCheckbox from "containers/Forms/FormCheckbox"
import { Color } from "global/styles/constants"
import globalStyles from "global/styles/styles"
import EditMasterPersonalData from "./EditMasterPersonalData"
import { Formik, Field } from "formik"
import { getColorWithOpacity } from "global/styles/utils"
import EditMasterWorkTime from "./EditMasterWorkTime"
import {
    dateSwapYearAndMonthFormatter,
    phoneNumberFormatter,
    simplePhoneNumberFormatter,
    toCanonicalDateFormatter
} from "utils/formatters"
import axios from "axios"
import { axiosAPI2 } from "utils/axios"
import { createMasterEndpoint, createMastersWorkTimeEndpoint } from "utils/apiHelpers/endpointGenerators"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import Toast from 'react-native-simple-toast'

const EditMaster = ({ masters, services }) => {

    const [servicesCopy, setServicesCopy] = useState([])
    const [selectedMaster, setSelectedMaster] = useState(0)
    const [selectedService, setSelectedService] = useState(0)
    const [workTime, setWorkTime] = useState([])

    const userInfo = useSelector(userSelector)

    useEffect(() => {
        setServicesCopy(services.map(el => {
            return {
                ...el,
                masters: el.masters ? [...el.masters] : [],
                selected: masters[selectedMaster]?.services?.some(service => service === el.id)
            }
        }))
    }, [services, masters, selectedMaster])

    const onMasterSelected = (master) => {
        setSelectedMaster(masters.findIndex(el => el.id === master.id))
    }

    const onServiceSelected = (service) => {
        setSelectedService(servicesCopy.findIndex(el => el.id === service.id))
    }

    const onSubmit = async (values) => {
        const masterMainData = {
            first_name: values.name,
            second_name: values.surname,
            third_name: values.patronymic,
            phone: simplePhoneNumberFormatter(values.phone),
            email: values.email,
            password: values.password,
            services: values.services.map((el, index) =>
                el === 'true' ? services[index].id : null
            ).filter(val => val)
        }
        const masterWorkTime = {
            dates: workTime.map(el => ({
                startDate: toCanonicalDateFormatter(
                    dateSwapYearAndMonthFormatter(el.date, '-'),
                    `${el.startH}:${el.startM}`),
                endDate: toCanonicalDateFormatter(
                    dateSwapYearAndMonthFormatter(el.date, '-'),
                    `${el.endH}:${el.endM}`),
            }))
        }

        return axios.all([
            axiosAPI2.put(createMasterEndpoint(masters[selectedMaster].id),
                masterMainData,
                {
                    headers: createAuthorizationHeader(userInfo.authToken)
                }),
            axiosAPI2.post(createMastersWorkTimeEndpoint(masters[selectedMaster].id),
                masterWorkTime,
                {
                    headers: createAuthorizationHeader(userInfo.authToken)
                })
        ])
            .then(axios.spread((masterMainDataRes, masterWorkTimeRes) => {
                if (masterMainDataRes.data.success && masterWorkTimeRes.data.success) {
                    Toast.show("Информация о мастере обновлена")
                }
                else {
                    Toast.show("Не удалось обновить информацию о мастере: " +
                        masterMainDataRes.data.data.message + ' ' +
                        masterWorkTimeRes.data.data.message)
                }
            }))
            .catch(err => {
                Toast.show("Ошибка: не удалось обновить информацию о мастере")
            })
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
                <View
                    pointerEvents={isSubmitting ? 'none' : 'auto'}
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
                                Мастер:{'\n'}
                                {masters[selectedMaster] ?
                                    masters[selectedMaster].name + ' ' +
                                    masters[selectedMaster].surname :
                                    '-'}
                            </Text>
                            <ItemSlider
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
                            <ItemSlider
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
                                            disabled={isSubmitting}
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
                </View>
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