import FormFieldInput from "containers/Forms/FormFieldInput"
import { Field } from "formik"
import { Color } from "global/styles/constants"
import { getColorWithOpacity } from "global/styles/utils"
import React from "react"
import { View, StyleSheet } from "react-native"
import { numberFormatter, timeFormatter } from "utils/formatters"
import { fieldNonEmptyValidator, numberValidator, timeValidator } from "utils/validators"

const EditServiceMainData = () => {
    return (
        <View
            style={styles.container}
        >
            <View>
                <Field
                    name="name"
                    component={FormFieldInput}
                    label="Название:"
                    validate={fieldNonEmptyValidator}
                    style={styles.inputFieldContainer}
                />
                <Field
                    name="description"
                    component={FormFieldInput}
                    label="Описание:"
                    multiline
                    style={styles.inputFieldContainer}
                />
                <Field
                    name="duration"
                    component={FormFieldInput}
                    label="Длительность:"
                    validate={(value) => timeValidator(value, false, 99, 59)}
                    mask={timeFormatter}
                    placeholder="00:00"
                    keyboardType="decimal-pad"
                    style={styles.inputFieldContainer}
                />
                <Field
                    name="price"
                    component={FormFieldInput}
                    label="Стоимость:"
                    mask={numberFormatter}
                    validate={numberValidator}
                    placeholder="100.00"
                    keyboardType="decimal-pad"
                    style={styles.inputFieldContainer}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 5,
        backgroundColor: getColorWithOpacity(Color.Gray, 0.1),
        borderColor: Color.Gray,
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        paddingTop: 0
    },
    inputFieldContainer: {
        marginTop: 10,
    }
})

export default EditServiceMainData