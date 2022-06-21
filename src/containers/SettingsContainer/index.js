import React, { useContext } from 'react'
import ScreenTemplate from 'components/ScreenTemplate/ScreenTemplate'
import { StyleSheet, Text, View } from 'react-native'
import Button from 'components/Elements/Button/Button'
import SettingsSection from 'components/Elements/SettingsSection/SettingsSection'
import useSettings from './useSettings'
import { nameFormatter, phoneNumberFormatter, simplePhoneNumberFormatter } from 'utils/formatters'
import { Formik, Field } from 'formik'
import FormFieldInput from 'containers/Forms/FormFieldInput'
import { emailValidator, nameValidator, passwordValidator, patronymicValidator, phoneNumberValidator, surnameValidator } from 'utils/validators'
import ModalWindow from 'components/Elements/ModalWindow/ModalWindow'
import FormCodeFieldInput from 'containers/Forms/FormCodeFieldInput'
import { Color } from 'global/styles/constants'
import { ENDPOINT_USER } from 'constants/endpoints'
import { GlobalStylesContext } from 'global/styles/GlobalStylesWrapper'

const SettingsContainer = () => {
    const {
        initialValues,
        extraInitialValues,
        sendCodeRemainingTime,
        isShowModal,
        setIsShowModal,
        onSignOut,
        onSubmit,
    } = useSettings()
    const globalStyles = useContext(GlobalStylesContext)

    return (
        <>
            <Text style={globalStyles.pageTitle}>Настройки</Text>
            <Formik
                enableReinitialize
                initialValues={{
                    name: initialValues.name,
                    surname: initialValues.surname,
                    patronymic: initialValues.patronymic,
                    phone: initialValues.phone,
                    newPhone: extraInitialValues.newPhone,
                    email: initialValues.email,
                    password: initialValues.password,
                    code: ''
                }}
                onSubmit={onSubmit}
            >
                {({ handleSubmit, values, isValid, isSubmitting }) => (
                    <View
                        pointerEvents={isSubmitting ? 'none' : 'auto'}
                    >
                        <ModalWindow
                            isShowing={isShowModal}
                            setIshowing={setIsShowModal}
                        >
                            <Text
                                style={[
                                    globalStyles.text,
                                    globalStyles.centeredElement,
                                    styles.enterCodeText
                                ]}
                            >
                                Для обновления некоторых полей{'\n'}
                                требуется ввести код из СМС,
                                отправленного на номер{'\n'}
                                <Text
                                    style={styles.enterCodeTextPhone}
                                >
                                    {phoneNumberFormatter(values.newPhone)}
                                </Text>
                            </Text>
                            <Field
                                name="code"
                                component={FormCodeFieldInput}
                                phone={simplePhoneNumberFormatter(values.newPhone)}
                                startRemainingTime={sendCodeRemainingTime}
                                endpoint={ENDPOINT_USER}
                                style={{ color: Color.Black, borderColor: Color.Black }}
                            />
                            <View
                                style={globalStyles.centeredElement}
                            >
                                <Button
                                    primary
                                    title='Отправить'
                                    onPress={handleSubmit}
                                    disabled={values.code.length !== 4}
                                />
                            </View>
                        </ModalWindow>
                        <SettingsSection
                            title="Личные данные">
                            <Field
                                name="name"
                                component={FormFieldInput}
                                label="Имя:"
                                validate={nameValidator}
                                mask={nameFormatter}
                                style={styles.inputFieldContainer}
                            />
                            <Field
                                name="surname"
                                component={FormFieldInput}
                                label="Фамилия:"
                                validate={value => surnameValidator(value, true)}
                                mask={nameFormatter}
                                style={styles.inputFieldContainer}
                            />
                            <Field
                                name="patronymic"
                                component={FormFieldInput}
                                label="Отчество:"
                                validate={value => patronymicValidator(value, true)}
                                mask={nameFormatter}
                                style={styles.inputFieldContainer}
                            />
                        </SettingsSection>
                        <SettingsSection
                            title="Способы связи">
                            <Field
                                name="phone"
                                component={FormFieldInput}
                                label="Телефон:"
                                validate={phoneNumberValidator}
                                mask={phoneNumberFormatter}
                                style={styles.inputFieldContainer}
                            />
                            <Field
                                name="email"
                                component={FormFieldInput}
                                label="Почта:"
                                placeholder="email@mail.com"
                                validate={value => emailValidator(value, true)}
                                style={styles.inputFieldContainer}
                            />
                        </SettingsSection>
                        <SettingsSection
                            title="Изменение пароля"
                        >
                            <Field
                                name="password"
                                component={FormFieldInput}
                                label="Пароль:"
                                placeholder="Новый пароль"
                                secureTextEntry
                                validate={value => passwordValidator(value, true)}
                                style={styles.inputFieldContainer}
                            />
                        </SettingsSection>
                        <View>
                            <Text
                                style={globalStyles.text}
                                onPress={onSignOut}
                            >
                                Выйти из аккаунта
                            </Text>
                        </View>
                        <View
                            style={globalStyles.centeredElement}
                        >
                            <Button
                                primary
                                title="Сохранить"
                                onPress={handleSubmit}
                                disabled={!isValid || isSubmitting}
                            />
                        </View>
                    </View>
                )}
            </Formik>
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        marginVertical: 20,
    },
    enterCodeText: {
        textAlign: 'center',
        marginBottom: 10,
        color: Color.Black
    },
    enterCodeTextPhone: {
        color: Color.SoftBlue
    },
    inputFieldContainer: {
        marginTop: 10,
    }
})

export default SettingsContainer