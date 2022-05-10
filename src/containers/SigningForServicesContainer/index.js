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
import {
    ENDPOINT_ALL_MASTERS,
    ENDPOINT_ALL_SERVICES,
    ENDPOINT_ORDERS
} from "constants/endpoints";
import { useSelector } from "react-redux";
import { LoadingIcon, ReloadIcon } from "components/Elements/Icons/Index";
import Loadable, { loadableStatus } from "components/Elements/Loadable/Loadable";
import { Color } from "global/styles/constants";
import { useNavigation } from "@react-navigation/native";
import { toCanonicalDateFormatter } from "utils/formatters";
import Toast from 'react-native-simple-toast'
import { TouchableOpacity } from "react-native-gesture-handler";

const SigningForServicesContainer = () => {
    const [services, setServices] = useState([])
    const [masters, setMasters] = useState([])
    const [orderServices, setOrderServices] = useState([])
    const [loadingStatus, setLoadingStatus] = useState(loadableStatus.LOADING)
    const navigation = useNavigation()

    const token = useSelector(state => state.user.authToken)
    useEffect(() => {
        getMastersAndServices()
    }, [])

    const getMastersAndServices = async () => {
        setLoadingStatus(loadableStatus.LOADING)
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
            if (mastersData.length === 0 || servicesData.length === 0)
                return
            mastersData.forEach(el => {
                el.name = el.fio.firstName
                if (el.services) {
                    el.servicesFormatted = servicesData.
                        filter(a => el.services.find(b => b === a.id)).map(c => c.name).join(', ')
                }
                else el.servicesFormatted = '—'
            })
            servicesData.forEach(el => {
                el.mastersFormatted = mastersData.
                    filter(a => el.masters?.find(b => b === a.id)).map(c => c.name).join(', ')
            })
            setServices(servicesData)
            setMasters(mastersData)
            setLoadingStatus(loadableStatus.SUCCESS)
        })).catch(err => {
            setLoadingStatus(loadableStatus.FAIL)
        })
    }

    const onAddService = ({
        master,
        service,
        date,
        time
    }) => {
        let addingError = false
        const curServiceStart = toCanonicalDateFormatter(date, time)
        const curServiceEnd = new Date(curServiceStart)
        const regex = /(\d*):(\d*)/
        const [servDurationH, servDurationM] =
            service.duration
                .match(regex).slice(1)
                .map(el => Number(el))

        curServiceEnd.setTime(curServiceEnd.getTime() +
            servDurationH * 60 * 60 * 1000 +
            servDurationM * 60 * 1000)

        for (const el of orderServices) {
            const ordServiceStart = toCanonicalDateFormatter(el.date, el.time)
            const ordServiceEnd = new Date(ordServiceStart)
            const [ordServDurationH, ordServDurationM] =
                el.service.duration
                    .match(regex).slice(1)
                    .map(el => Number(el))

            ordServiceEnd.setTime(ordServiceEnd.getTime() +
                ordServDurationH * 60 * 60 * 1000 +
                ordServDurationM * 60 * 1000)

            if (curServiceStart >= ordServiceStart &&
                curServiceStart < ordServiceEnd ||
                curServiceEnd >= ordServiceStart &&
                curServiceEnd <= ordServiceEnd
            ) {
                if (el.master.id === master.id) {
                    Toast.show("Вы не можете записаться к одному мастеру " +
                        "на разные услуги в одно и то же время")
                    addingError = true
                    break
                }
                if (el.service.id === service.id) {
                    Toast.show("Вы не можете записаться две одинаковые " +
                        "услуги на одно время")
                    addingError = true
                    break
                }
            }
        }

        if (addingError) return false

        setOrderServices([
            ...orderServices,
            {
                master,
                service,
                date,
                time
            }
        ])

        return true
    }

    const onSubmitServices = () => {
        const appointments = []
        orderServices.forEach(el => {
            const appointment = {
                date: '2022-05-02T09:00:00Z',
                master_id: el.master.id,
                service_id: el.service.id
            }
            appointments.push(appointment)
        })
        const data = {
            appointments
        }
        axiosAPI2.post(
            ENDPOINT_ORDERS,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
                if (res.data.success) {
                    Toast.show("Запись успешно создана")
                    setOrderServices([])
                }
            }).catch(err => {
                Toast.show("Произошла ошибка при отправке запроса")
            })
    }

    const onGoToMainScreenButtonPress = () => {
        navigation.navigate('Home')
    }

    return (
        <ScreenTemplate>
            <Text style={globalStyles.page_title}>Запись на услуги</Text>
            <Loadable
                status={loadingStatus}
                onLoadingComponent={
                    <View
                        style={styles.onLoadingContainer}
                    >
                        <Text
                            style={[
                                globalStyles.text,
                                globalStyles.centeredElement,
                                styles.onLoadingText
                            ]}
                        >
                            Получаем информацию о мастерах и услугах
                        </Text>
                        <View
                            style={globalStyles.centeredElement}
                        >
                            <LoadingIcon
                                width={30}
                                height={30}
                                color={Color.Gray}
                            />
                        </View>
                    </View>
                }
                onFailComponent={
                    <View
                        style={styles.onFailContainer}
                    >
                        <Text
                            style={[
                                globalStyles.text,
                                globalStyles.centeredElement,
                                styles.onFailText
                            ]}
                        >
                            Что-то пошло не так
                        </Text>
                        <View
                            style={[
                                globalStyles.centeredElement,
                                styles.onFailButtonContainer
                            ]}
                        >
                            <TouchableOpacity
                                onPress={getMastersAndServices}
                            >
                                <ReloadIcon
                                    color={Color.White}
                                    width={30}
                                    height={30}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={[
                                globalStyles.centeredElement,
                                styles.onFailButtonContainer
                            ]}
                        >
                            <Button
                                title="Вернуться на главную"
                                size="large"
                                onPress={onGoToMainScreenButtonPress}
                            />
                        </View>
                    </View>
                }
            >
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
                            onPress={onSubmitServices}
                            disabled={!orderServices.length}
                            style={[
                                globalStyles.centeredElement,
                                styles.confirmOrderButton
                            ]}
                        />
                    </View>
                </View>
            </Loadable>
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
    },
    onLoadingContainer: {

    },
    onLoadingText: {
        marginVertical: 10
    },
    onFailContainer: {

    },
    onFailText: {
        marginVertical: 10
    },
    onFailButtonContainer: {
        marginBottom: 20,
    }
})


export default SigningForServicesContainer