import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import PageTemplate from "components/PageTemplate/Pagetemplate";
import globalStyles from "global/styles/styles";
import Button from "components/Elements/Button/Button";
import axiosAPI from "utils/axios";
import ServiceNodeList from "./ServiceNodeList";
import AddServiceNode from "./AddServiceNode";
import SectionSeparator from "components/Elements/SectionSeparator/SectionSeparator";
import useSettings from "containers/SettingsContainer/useSettings";

const SigningForServicesContainer = () => {

    const [services, setServices] = useState([])
    const [masters, setMasters] = useState()
    const [orderServices, setOrderServices] = useState([])

    useEffect(() => {
        //  Запрос данных у сервера
        setServices(
            [
                {
                    id: 1, name: 'Бритьё ресничек', description: 'Ну, мы побреем вам подмышки с помощью новейших технологий',
                    duration: '2:05', price: 3000, masters: [3, 5, 6], mastersFormatted: 'Никита, Алексей, Павел'
                },
                {
                    id: 2, name: 'Стрижка', description: 'Стрижка вашей крутой головы',
                    duration: '1:12', price: 4500, masters: [3, 5, 6], mastersFormatted: 'Никита, Алексей, Павел'
                },
                {
                    id: 3, name: 'Бритьё бороды', description: 'Побреем бороду',
                     duration: '2:07', price: 300, masters: [3, 5, 6], mastersFormatted: 'Никита, Алексей, Павел'
                },
                {
                    id: 4, name: 'Стрижка усиков', description: 'У вас есть усы?',
                     duration: '0:30', price: 550, masters: [3, 5, 6], mastersFormatted: 'Никита, Алексей, Павел'
                },
                {
                    id: 5, name: 'Депилирование волос в носу', description: 'Да, даже такое делаем',
                     duration: '3:05', price: 8000, masters: [3, 5, 6], mastersFormatted: 'Никита, Алексей, Павел'
                },
                {
                    id: 6, name: 'Бритьё подмышек', description: 'И такое',
                     duration: '2:00', price: 100, masters: [3, 5, 6], mastersFormatted: 'Никита, Алексей, Павел'
                }
            ]
        )
        setMasters(
            [
                {
                    id: 1, name: 'Иван', services: [1, 4, 6],
                    servicesFormatted: 'бритьё ресничек, стрижка усиков, бритьё подмышек'
                },
                {
                    id: 2, name: 'Дмитрий', services: [1, 4, 6],
                    servicesFormatted: 'бритьё ресничек, стрижка усиков, бритьё подмышек'
                },
                {
                    id: 3, name: 'Никита', services: [1, 4, 6],
                    servicesFormatted: 'бритьё ресничек, стрижка усиков, бритьё подмышек'
                },
                {
                    id: 4, name: 'Анатолий', services: [1, 4, 6],
                    servicesFormatted: 'бритьё ресничек, стрижка усиков, бритьё подмышек'
                },
                {
                    id: 5, name: 'Алексей', services: [1, 4, 6],
                    servicesFormatted: 'бритьё ресничек, стрижка усиков, бритьё подмышек'
                },
                {
                    id: 6, name: 'Павел', services: [1, 4, 6],
                    servicesFormatted: 'бритьё ресничек, стрижка усиков, бритьё подмышек'
                },
            ]
        )
    }, [])

    const onAddService = ({
        master,
        service,
        date,
        time
    }) => {
        setOrderServices([
            ...orderServices,
            {
                master,
                service,
                date,
                time
            }
        ])
    }

    return (
        <PageTemplate>
            <Text style={globalStyles.page_title}>Запись на услуги</Text>
            <View
                style={styles.container}
            >
                <Text
                    style={[
                        globalStyles.text,
                        globalStyles.centeredElement,
                        styles.choosenServicesTitle
                    ]}
                >
                    Выбранные услуги: {orderServices.length}
                </Text>
                <ServiceNodeList
                    {...{
                        services: orderServices,
                        setServices: setOrderServices
                    }}
                />
                <AddServiceNode 
                {...{
                    masters,
                    services,
                        onAddService
                    }}
                />
                <View
                    style={styles.confirmOrderButtonContainer}
                >
                    <SectionSeparator />
                    <Button
                        title="Подтвердить услуги"
                        size="large"
                        style={[
                            globalStyles.centeredElement,
                            styles.confirmOrderButton
                        ]}
                    />
                </View>
            </View>
        </PageTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 5,
    },
    choosenServicesTitle: {
        marginBottom: 10,
    },
    confirmOrderButtonContainer: {
        marginTop: 20
    },
    confirmOrderButton: {
        marginTop: 10,
    }
})


export default SigningForServicesContainer