import FormFieldInput from "containers/Forms/FormFieldInput"
import { Field } from "formik"
import { Color } from "global/styles/constants"
import { getColorWithOpacity } from "global/styles/utils"
import React from "react"
import { View, StyleSheet } from "react-native"
import { nameFormatter, phoneNumberFormatter } from "utils/formatters"
import {
    emailValidator,
    nameValidator,
    passwordValidator,
    patronymicValidator,
    phoneNumberValidator,
    surnameValidator
} from "utils/validators"

const EditMasterPersonalData = ({ editPassword }) => {
    return (
        <View
            style={styles.container}
        >
            <View>
                <Field
                    name="surname"
                    component={FormFieldInput}
                    label="Фамилия:"
                    validate={surnameValidator}
                    mask={nameFormatter}
                />
                <Field
                    name="name"
                    component={FormFieldInput}
                    label="Имя:"
                    validate={nameValidator}
                    mask={nameFormatter}
                />
                <Field
                    name="patronymic"
                    component={FormFieldInput}
                    label="Отчество:"
                    validate={(val) => patronymicValidator(val, true)}
                    mask={nameFormatter}
                />
                <Field
                    name="phone"
                    component={FormFieldInput}
                    label="Телефон:"
                    validate={phoneNumberValidator}
                    mask={phoneNumberFormatter}
                />
                <Field
                    name="email"
                    component={FormFieldInput}
                    label="Email:"
                    validate={emailValidator}
                />
                {editPassword && (
                    <Field
                        name="password"
                        component={FormFieldInput}
                        label="Пароль:"
                        validate={passwordValidator}
                        secureTextEntry
                    />
                )}
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
    }
})

export default EditMasterPersonalData