import Button from "components/Elements/Button/Button"
import { Formik } from "formik"
import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text } from "react-native"
import { Field } from "formik"
import SectionSeparator from "components/Elements/SectionSeparator/SectionSeparator"
import Slider from "components/Elements/Slider/Slider"
import FormCheckbox from "containers/Forms/FormCheckbox"
import globalStyles from "global/styles/styles"
import { Color } from "global/styles/constants"
import { getColorWithOpacity } from "global/styles/utils"
import EditServiceMainData from "./EditServiceMainData"

const AddService = ({
    setServices,
    masters
}) => {

    const [mastersCopy, setMastersCopy] = useState([])
    useEffect(() => {
        setMastersCopy(masters.map(el => {
            return {
                ...el,
                services: [...el.services],
                selected: false
            }
        }))
    }, [masters])

    const onSubmit = (values) => {

    }

    return (
        <View>
            <Formik
                onSubmit={onSubmit}
                initialValues={{
                    masters: mastersCopy.map(el => el.selected ? 'true' : 'false')
                }}
                enableReinitialize
            >
                {({ handleSubmit }) => (
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
                            data={mastersCopy}
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