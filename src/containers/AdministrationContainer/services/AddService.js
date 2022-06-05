import Button from "components/Elements/Button/Button"
import { Formik } from "formik"
import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { Field } from "formik"
import SectionSeparator from "components/Elements/SectionSeparator/SectionSeparator"
import Slider from "components/Elements/Slider/Slider"
import FormCheckbox from "containers/Forms/FormCheckbox"
import globalStyles from "global/styles/styles"
import { Color } from "global/styles/constants"
import { getColorWithOpacity } from "global/styles/utils"
import EditServiceMainData from "./EditServiceMainData"
import { axiosAPI2 } from "utils/axios"
import { ENDPOINT_SERVICES } from "constants/endpoints"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import Toast from 'react-native-simple-toast'

const AddService = ({
    services,
    setServices,
    masters,
    workplaces
}) => {

    const userInfo = useSelector(userSelector)
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
        return axiosAPI2.post(ENDPOINT_SERVICES, data, {
            headers: createAuthorizationHeader(userInfo.authToken)
        })
        .then(res => {
            Toast.show("Услуга была успешно добавлена")
            values.name = ''
            values.description = '',
            values.duration = ''
            values.price = ''
            setServices([...services, res.data.data])
        })
        .catch(err => {
            Toast.show("Произошла ошибка при добавлении услуги")
        })
    }

    return (
        <View>
            <Formik
                onSubmit={onSubmit}
                initialValues={{
                    name: '',
                    description: '',
                    duration: '',
                    price: '',
                    masters: masters.map(el => 'false')
                }}
                enableReinitialize
                validateOnMount
            >
                {({ handleSubmit, isSubmitting, isValid }) => (
                    <>
                        <Text
                            style={globalStyles.title}
                        >
                            Данные об услуге
                        </Text>
                        <EditServiceMainData />
                        <Text
                            style={globalStyles.title}
                        >
                            Мастера для услуги
                        </Text>
                        <Slider
                            data={masters}
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
                        <View
                            style={styles.saveButtonContainer}
                        >
                            <Button
                                primary
                                title="Сохранить"
                                onPress={handleSubmit}
                                disabled={isSubmitting || !isValid}
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

export default AddService