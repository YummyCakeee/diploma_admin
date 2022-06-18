import Button from "components/Elements/Button/Button"
import { Formik } from "formik"
import React, { useContext } from "react"
import { StyleSheet, View, Text } from "react-native"
import { Field } from "formik"
import SectionSeparator from "components/Elements/SectionSeparator/SectionSeparator"
import ItemSlider from "components/Elements/ItemSlider/ItemSlider"
import FormCheckbox from "containers/Forms/FormCheckbox"
import { Color } from "global/styles/constants"
import { getColorWithOpacity } from "global/styles/utils"
import EditServiceMainData from "./EditServiceMainData"
import { axiosAPI2 } from "utils/axios"
import { ENDPOINT_SERVICES } from "constants/endpoints"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import Toast from 'react-native-simple-toast'
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"

const AddService = ({
    services,
    setServices,
    masters,
    workplaces
}) => {

    const userInfo = useSelector(userSelector)
    const globalStyles = useContext(GlobalStylesContext)

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
            values.masters = masters.map(el => 'false')
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
                        <ItemSlider
                            data={masters}
                            itemComponent={({ item, isSelected, index }) => (
                                <View
                                    style={styles.sliderItem}
                                >
                                    <Text
                                        style={[
                                            globalStyles.text,
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