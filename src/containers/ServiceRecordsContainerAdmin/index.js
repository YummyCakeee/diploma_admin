import React, { useContext, useEffect, useState } from "react"
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from "react-native"
import ScreenTemplate from "components/ScreenTemplate/ScreenTemplate"
import ServiceNodeList from "components/ServiceNodeList/ServiceNodeList"
import { axiosAPI2 } from "utils/axios"
import { ENDPOINT_APPOINTMENTS, ENDPOINT_MASTERS } from "constants/endpoints"
import Toast from 'react-native-simple-toast'
import { useSelector } from "react-redux"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { dateSwapYearAndMonthFormatter } from "utils/formatters"
import Loadable, { loadableStatus } from "components/Elements/Loadable/Loadable"
import { LoadingIcon, ReloadIcon } from "components/Elements/Icons/Index"
import { Color } from "global/styles/constants"
import Button from "components/Elements/Button/Button"
import { useNavigation } from "@react-navigation/native"
import { Screen } from "components/AppNavigation/AppNavigation"
import { createClientEndpoint } from "utils/apiHelpers/endpointGenerators"
import Combobox from "components/Elements/Combobox/Combobox"
import { userSelector } from "store/selectors/userSlice"
import { GlobalStylesContext } from "global/styles/GlobalStylesWrapper"

const ServiceRecordsContainerAdmin = () => {

    const [orders, setOrders] = useState([])
    const [loadingStatus, setLoadingStatus] = useState(loadableStatus.LOADING)
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(null)
    const [masters, setMasters] = useState([])
    const [masterFilter, setMasterFilter] = useState(null)
    const navigation = useNavigation()
    const globalStyles = useContext(GlobalStylesContext)

    const userInfo = useSelector(userSelector)
    useEffect(() => {
        getMasters()
    }, [])

    useEffect(() => {
        getOrders()
    }, [masterFilter])

    useEffect(() => {
        if (orders[selectedOrderIndex]?.client.name === '') {
            getClientName(selectedOrderIndex)
        }

    }, [selectedOrderIndex])

    const getOrders = async () => {
        setSelectedOrderIndex(null)
        setLoadingStatus(loadableStatus.LOADING)
        axiosAPI2.get(ENDPOINT_APPOINTMENTS,
            {
                headers: createAuthorizationHeader(userInfo.authToken),
                params: { master_id: masterFilter }
            })
            .then(res => {
                if (res.data.success) {
                    const ordersInfo = res.data.data
                    const data = []
                    if (ordersInfo) {
                        ordersInfo.forEach(el => {
                            const master = {
                                id: el.master.id,
                                name: el.master.first_name,
                                surname: el.master.second_name,
                                patronymic: el.master.third_name
                            }
                            const service = el.service
                            const [date, time] = el.date
                                .match(/([\w | \-]*)T([\w | \:]*):00Z/)
                                .slice(1)
                            const client = {
                                id: el.user_id,
                                name: '',
                                surname: '',
                                patronymic: ''
                            }
                            data.push({
                                id: el.id,
                                orderId: el.order_id,
                                master,
                                service,
                                client,
                                date: dateSwapYearAndMonthFormatter(date),
                                time
                            })
                        })
                    }
                    setOrders(data)
                    setLoadingStatus(loadableStatus.SUCCESS)
                }
            }).catch(err => {
                setLoadingStatus(loadableStatus.FAIL)
                Toast.show("Не удалось загрузить записи")
            })
    }

    const getMasters = async () => {
        setLoadingStatus(loadableStatus.LOADING)
        axiosAPI2.get(ENDPOINT_MASTERS,
            {
                headers: createAuthorizationHeader(userInfo.authToken)
            }
        )
            .then(res => {
                if (res.data.success) {
                    const mastersData = res.data.data
                    mastersData.forEach(el => {
                        el.name = el.first_name
                        el.surname = el.second_name
                        el.patronymic = el.third_name
                        delete el.first_name
                        delete el.second_name
                        delete el.third_name
                    })
                    mastersData.unshift({ name: 'Нет' })
                    setMasters(mastersData)
                    setLoadingStatus(loadableStatus.SUCCESS)
                }
                else {
                    Toast.show("Ошибка: не удалось загрузить список мастеров: " + res.data.data.message)
                    setLoadingStatus(loadableStatus.FAIL)
                }
            })
            .catch(err => {
                Toast.show("Ошибка: не удалось загурзить список мастеров")
                setLoadingStatus(loadableStatus.FAIL)
            })
    }

    const getClientName = async (orderIndex) => {
        const clientId = orders[orderIndex].client.id
        axiosAPI2.get(createClientEndpoint(clientId),
            {
                headers: createAuthorizationHeader(userInfo.authToken)
            }
        )
            .then(res => {
                if (res.data.success) {
                    const clientData = res.data.data
                    setOrders(orders.map(el => {
                        if (el.client.id !== clientId)
                            return el
                        const client = {
                            ...el.client,
                            name: clientData.first_name,
                            surname: clientData.second_name,
                            patronymic: clientData.third_name
                        }
                        return { ...el, client }
                    }))
                }
                else Toast.show("Ошибка: не удалось загрузить информацию о клиенте: " + res.data.data.message)
            })
            .catch(err => {
                Toast.show("Ошибка: не удалось загурзить информацию о клиенте")
            })
    }

    const onMasterFilterChanged = (master) => {
        if (master.id) {
            setMasterFilter(master.id)
        }
        else setMasterFilter(null)
    }

    const onNodePress = (index) => {
        setSelectedOrderIndex(index)
    }

    const onGoToMainScreenButtonPress = () => {
        navigation.navigate(Screen.Home)
    }

    const onReloadData = () => {
        if (masters.length === 0)
            getMasters()
        if (orders.length === 0)
            getOrders()
    }

    return (
        <ScreenTemplate>
            <View>
                <Text
                    style={globalStyles.pageTitle}
                >
                    Записи клиентов на услуги
                </Text>
            </View>
            {masters.length > 0 && (
                <Combobox
                    data={masters}
                    itemComponent={({ item }) => (
                        <Text
                            style={globalStyles.text}
                        >
                            {item.name}
                        </Text>
                    )}
                    headerComponent={({ item }) => (
                        <Text
                            style={globalStyles.text}
                        >
                            {item?.name}
                        </Text>
                    )}
                    onItemSelected={onMasterFilterChanged}
                    label="Фильтрация по мастеру: "
                />
            )}
            <Loadable
                status={loadingStatus}
                onLoadingComponent={() => (
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
                            Получаем записи
                        </Text>
                        <View
                            style={globalStyles.centeredElement}
                        >
                            <LoadingIcon
                                color={Color.Gray}
                                width={30}
                                height={30}
                            />
                        </View>
                    </View>
                )}
                onFailComponent={() => (
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
                                styles.buttonContainer
                            ]}
                        >
                            <TouchableOpacity
                                onPress={onReloadData}
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
                                styles.buttonContainer
                            ]}
                        >
                            <Button
                                primary
                                title="Вернуться на главную"
                                size="large"
                                onPress={onGoToMainScreenButtonPress}
                            />
                        </View>
                    </View>
                )}
            >
                {orders.length > 0 ? (
                    <>
                        <ServiceNodeList
                            services={orders}
                            onNodePress={onNodePress}
                            style={styles.serviceListContainer}
                        />
                        <View
                            style={styles.serviceInfoContainer}
                        >
                            <Text
                                style={globalStyles.title}
                            >
                                Информация о записи:
                            </Text>
                            {selectedOrderIndex !== null ? (
                                <View
                                    style={styles.serviceInfoContainer}
                                >
                                    <View
                                        style={styles.serviceInfoRow}
                                    >
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                styles.serviceInfoTextLabel
                                            ]}
                                        >
                                            Номер в списке:
                                        </Text>
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                styles.serviceInfoText
                                            ]}
                                        >
                                            {selectedOrderIndex + 1}
                                        </Text>
                                    </View>

                                    <View
                                        style={styles.serviceInfoRow}
                                    >
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                styles.serviceInfoTextLabel
                                            ]}
                                        >
                                            Услуга:
                                        </Text>
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                styles.serviceInfoText
                                            ]}
                                        >
                                            {orders[selectedOrderIndex]?.service.name}
                                        </Text>
                                    </View>

                                    <View
                                        style={styles.serviceInfoRow}
                                    >
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                styles.serviceInfoTextLabel
                                            ]}
                                        >
                                            Мастер:
                                        </Text>
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                styles.serviceInfoText
                                            ]}
                                        >
                                            {[
                                                orders[selectedOrderIndex]?.master.surname,
                                                orders[selectedOrderIndex]?.master.name,
                                                orders[selectedOrderIndex]?.master.patronymic
                                            ].join(' ')}
                                        </Text>
                                    </View>

                                    <View
                                        style={styles.serviceInfoRow}
                                    >
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                styles.serviceInfoTextLabel
                                            ]}
                                        >
                                            Описание:
                                        </Text>
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                styles.serviceInfoText
                                            ]}
                                        >
                                            {orders[selectedOrderIndex]?.service.description}
                                        </Text>
                                    </View>

                                    <View
                                        style={styles.serviceInfoRow}
                                    >
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                styles.serviceInfoTextLabel
                                            ]}
                                        >
                                            Дата:
                                        </Text>
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                styles.serviceInfoText
                                            ]}
                                        >
                                            {orders[selectedOrderIndex]?.date + ' - ' +
                                                orders[selectedOrderIndex]?.time}
                                        </Text>
                                    </View>

                                    <View
                                        style={styles.serviceInfoRow}
                                    >
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                styles.serviceInfoTextLabel
                                            ]}
                                        >
                                            Клиент:
                                        </Text>
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                styles.serviceInfoText
                                            ]}
                                        >
                                            {[
                                                orders[selectedOrderIndex]?.client.surname,
                                                orders[selectedOrderIndex]?.client.name,
                                                orders[selectedOrderIndex]?.client.patronymic
                                            ].join(' ')}
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <Text
                                    style={[
                                        globalStyles.centeredElement,
                                        globalStyles.text,
                                        styles.chooseServiceText,
                                    ]}
                                >
                                    Выберите запись
                                </Text>
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        <Text
                            style={[
                                globalStyles.text,
                                globalStyles.centeredElement,
                                styles.noRecordsText
                            ]}
                        >
                            У клиентов ещё нет записей
                        </Text>
                    </>
                )}
            </Loadable>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    serviceListContainer: {
        maxHeight: 300,
        marginVertical: 20,
    },
    modalButtonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: 'center'
    },
    onLoadingText: {
        marginVertical: 10
    },
    onFailText: {
        marginVertical: 10
    },
    buttonContainer: {
        marginBottom: 20,
    },
    noRecordsText: {
        color: Color.LightGray,
        marginBottom: 20,
    },
    serviceInfoContainer: {
        marginHorizontal: 10,
    },
    serviceInfoRow: {
        marginBottom: 5,
        display: "flex",
        flexDirection: "row",

    },
    serviceInfoText: {
        maxWidth: '75%'
    },
    serviceInfoTextLabel: {
        color: Color.LightGray,
        width: '25%'
    },
    chooseServiceText: {
        color: Color.LightGray
    }
})

export default ServiceRecordsContainerAdmin