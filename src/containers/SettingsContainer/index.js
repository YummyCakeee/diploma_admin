import React, { useState } from 'react'
import ScreenTemplate from 'components/ScreenTemplate/ScreenTemplate'
import InputField from 'components/Elements/InputField/InputField'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import globalStyles from 'global/styles/styles'
import Button from 'components/Elements/Button/Button'
import SettingsSection from 'components/Elements/SettingsSection/SettingsSection'
import Combobox from 'components/Elements/Combobox/Combobox'
import useSettings from './useSettings'
import { useNavigation } from '@react-navigation/core'
import { phoneNumberFormatter } from 'utils/formatters'

const SettingsContainer = () => {
    const navigation = useNavigation()
    const {
        name,
        setName,
        surname,
        setSurname,
        patronymic,
        setPatronymic,
        phone,
        setPhone,
        email,
        setEmail,
        masters,
        personalMaster,
        setPersonalMaster,
        onSignOut,
        onSaveInfo,
    } = useSettings()
    return (
        <ScreenTemplate>
            <Text style={globalStyles.page_title}>Настройки</Text>
                <SettingsSection
                    title="Личные данные">
                    <InputField
                        label="Фамилия:"
                        value={surname}
                        onChange={setSurname}
                    />
                    <InputField
                        label="Имя:"
                        value={name}
                        onChange={setName}
                    />
                    <InputField
                        label="Отчество:"
                        value={patronymic}
                        onChange={setPatronymic}
                    />
                </SettingsSection>
                <SettingsSection
                    title="Способы связи">
                    <InputField
                        label="Телефон:"
                        value={phone}
                        onChange={setPhone}
                        mask={phoneNumberFormatter}
                    />
                    <InputField
                        label="Почта:"
                        value={email}
                        onChange={setEmail}
                    />
                </SettingsSection>
                <SettingsSection
                    title="Перcональные предпочтения"
                >
                    <Combobox
                        label="Мастер:"
                        items={masters}
                        initialSelectedItem={personalMaster}
                        onSelect={(el) => setPersonalMaster(el)}
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
                <View style={[styles.button, globalStyles.centeredElement]}>
                    <Button
                        title="Сохранить"
                        onPress={onSaveInfo}
                    />
                </View>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    button: {
        marginVertical: 20,
    }

})

export default SettingsContainer