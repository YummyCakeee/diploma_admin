import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import ScreenTemplate from "components/ScreenTemplate/ScreenTemplate";
import globalStyles from "global/styles/styles";
import Button from "components/Elements/Button/Button";
import { axiosAPI, axiosAPI2 } from "utils/axios";
import axios from "axios";
import ServiceNodeList from "./ServiceNodeList";
import AddServiceNode from "./AddServiceNode";
import SectionSeparator from "components/Elements/SectionSeparator/SectionSeparator";
import { ENDPOINT_ALL_MASTERS, ENDPOINT_ALL_SERVICES } from "constants/endpoints";
import { useSelector } from "react-redux";
import { ReloadIcon } from "components/Elements/Icons/Index";

const SigningForServicesContainer = () => {

    const [services, setServices] = useState([])
    const [masters, setMasters] = useState()
    const [orderServices, setOrderServices] = useState([])
    const token = useSelector(state => state.user.authToken)
    useEffect(() => {
        getMastersAndServices()
    }, [])

    const getMastersAndServices = async () => {
        await axios.all(
            [
                axiosAPI2.get(ENDPOINT_ALL_SERVICES, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                axiosAPI2.get(ENDPOINT_ALL_MASTERS, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            ]
        ).then(axios.spread((servicesRes, mastersRes) => {
            let mastersData = mastersRes.data.data
            let servicesData = servicesRes.data.data
            mastersData.forEach(el => {
                el.name = el.fio.firstName
                el.servicesFormatted = servicesData.
                filter(a=> el.services.find(b => b === a.id)).map(c => c.name).join(', ')
            })
            servicesData.forEach(el => {
                el.mastersFormatted = mastersData.
                filter(a=> el.masters.find(b => b === a.id)).map(c => c.name).join(', ')
            })
            setServices(servicesData)
            setMasters(mastersData)
        })).catch(err => {
            console.log(err)
        })
    }


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
        <ScreenTemplate>
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
                        disabled={orderServices.length === 0}
                        style={[
                            globalStyles.centeredElement,
                            styles.confirmOrderButton
                        ]}
                    />
                </View>
            </View>
        </ScreenTemplate>
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