import Button from "components/Elements/Button/Button"
import { Formik } from "formik"
import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text } from "react-native"
import EditMasterPersonalData from "./EditMasterPersonalData"
import { Field } from "formik"
import SectionSeparator from "components/Elements/SectionSeparator/SectionSeparator"
import Slider from "components/Elements/Slider/Slider"
import FormCheckbox from "containers/Forms/FormCheckbox"
import globalStyles from "global/styles/styles"
import { Color } from "global/styles/constants"
import { getColorWithOpacity } from "global/styles/utils"

const AddMaster = ({
    setMasters,
    services
}) => {

    const [servicesCopy, setServicesCopy] = useState([])
    useEffect(() => {
        setServicesCopy(services.map(el => {
            return {
                ...el,
                masters: [...el.masters],
                selected: false
            }
        }))
    }, [services])

    const onServiceSelected = (service) => {

    }

    const onSubmit = (values) => {

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
                    services: servicesCopy.map(el => el.selected ? 'true' : 'false')
                }}
            >
                {({ handleSubmit }) => (
                    <>
                        <EditMasterPersonalData
                            editPassword
                        />
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
        flexDirection: 'row'
    },
    sliderItemText: {
        color: Color.Gray
    },
    sliderItemSelected: {
        color: Color.White
    },
})

export default AddMaster