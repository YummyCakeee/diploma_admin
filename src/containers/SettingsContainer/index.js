import React, { useState } from 'react'
import PageTemplate from 'components/PageTemplate/Pagetemplate'
import InputField from 'components/Elements/InputField/InputField'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import globalStyles from 'global/styles/styles'
import Button from 'components/Elements/Button/Button'
import SettingsSection from 'components/Elements/SettingsSection/SettingsSection'
import List from 'components/Elements/List/List'
import useSettings from './useSettings'
import { useNavigation } from '@react-navigation/core'
import { phoneNumberMask } from 'utils/textMasking'

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
    } = useSettings()
    const [canScroll, setCanScroll] = useState(true)
    const onInnerScrollTouchStart = () => {
        setCanScroll(false)
    }
    const onInnerScrollTouchEnd = () => {
        setCanScroll(true)
    }
    return (
        <PageTemplate>
            <Text style={globalStyles.page_title}>Настройки</Text>
            <ScrollView
                scrollEnabled={canScroll}>
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
                        mask={phoneNumberMask}
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
                    <List
                        label="Мастер:"
                        items={masters}
                        initialSelectedItem={personalMaster}
                        onSelect={(el) => setPersonalMaster(el)}
                        onTouchStart={onInnerScrollTouchStart}
                        onTouchEnd={onInnerScrollTouchEnd}
                    />
                </SettingsSection>
                <View>
                    <Text
                        style={globalStyles.text}
                        onPress={()=>navigation.navigate("Registration")}
                    >
                        Выйти из аккаунта
                        </Text>
                </View>
                <View style={[styles.button, globalStyles.centeredElement]}>
                    <Button
                        title="Сохранить"
                        onPress={() => navigation.navigate("Home")}
                    />
                </View>
            </ScrollView>
        </PageTemplate>
    )
}

const styles = StyleSheet.create({
    button: {
        marginVertical: 20,
    }

})

export default SettingsContainer