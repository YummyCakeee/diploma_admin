import Button from "components/Elements/Button/Button"
import { Formik } from "formik"
import React from "react"
import { StyleSheet, View, Text } from "react-native"
import EditMasterPersonalData from "./EditMasterPersonalData"
import { Field } from "formik"
import SectionSeparator from "components/Elements/SectionSeparator/SectionSeparator"
import Slider from "components/Elements/Slider/Slider"
import FormCheckbox from "containers/Forms/FormCheckbox"
import globalStyles from "global/styles/styles"
import { Color } from "global/styles/constants"
import { getColorWithOpacity } from "global/styles/utils"
import { axiosAPI2 } from "utils/axios"
import { ENDPOINT_MASTERS } from "constants/endpoints"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import Toast from 'react-native-simple-toast'
import { simplePhoneNumberFormatter } from "utils/formatters"

const AddMaster = ({
    masters,
    setMasters,
    services
}) => {

    const userInfo = useSelector(userSelector)

    const onSubmit = async (values) => {
        const data = {
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
        return axiosAPI2.post(ENDPOINT_MASTERS, data,
            {
                headers: createAuthorizationHeader(userInfo.authToken)
            })
            .then(res => {
                const resData = res.data
                if (resData.success) {
                    values.name = ''
                    values.surname = ''
                    values.patronymic = ''
                    values.phone = ''
                    values.email = ''
                    values.password = ''
                    const newMaster = {
                        id: resData.data.id,
                        name: resData.data.first_name,
                        surname: resData.data.second_name,
                        patronymic: resData.data.third_name,
                        phone: resData.data.phone,
                        email: resData.data.email,
                        services: resData.data.services,
                    }
                    setMasters([...masters, newMaster])
                    Toast.show("Мастер был успешно добавлен")
                }
                else Toast.show(`Ошибка: ${resData.data.message}`)
            })
            .catch(err => {
                Toast.show("Ошибка: Не удалось добавить мастера")
                console.log(err)
            })
    }

    return (
        <View>
            <Formik
                onSubmit={onSubmit}
                initialValues={{
                    name: '',
                    surname: '',
                    patronymic: '',
                    phone: '+7',
                    email: '',
                    password: '',
                    services: services.map(el => 'false')
                }}
                enableReinitialize
            >
                {({ handleSubmit, isSubmitting, isValid }) => (
                    <>
                        <Text
                            style={globalStyles.title}
                        >
                            Личные данные
                        </Text>
                        <EditMasterPersonalData
                            editPassword
                        />
                        <Text
                            style={globalStyles.title}
                        >
                            Услуги мастера
                        </Text>
                        <Slider
                            data={services}
                            itemComponent={({ item, isSelected, index }) => (
                                <View
                                    style={styles.sliderItem}
                                >
                                    <Text
                                        style={[
                                            globalStyles.text,
                                            isSelected ?
                                                styles.sliderItemSelected :
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
                        <View
                            style={styles.saveButtonContainer}
                        >
                            <Button
                                title="Сохранить"
                                primary
                                disabled={isSubmitting || !isValid}
                                onPress={handleSubmit}
                            />
                        </View>
                    </>
                )}
            </Formik>
        </View>
    )
}

const styles = StyleSheet.create({
    saveButtonContainer: {
        alignSelf: 'center',
        marginVertical: 5,
    },
    sliderContainer: {
        height: 200,
        width: 250,
        paddingHorizontal: 5,
        borderColor: Color.Gray,
        backgroundColor: getColorWithOpacity(Color.Gray, 0.1),
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 5,
        alignSelf: 'center'
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
    },
    sliderItemSelected: {
        color: Color.White
    },
})

export default AddMaster