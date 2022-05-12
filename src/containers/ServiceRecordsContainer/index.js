import React, { useEffect, useState } from "react"
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from "react-native"
import ScreenTemplate from "components/ScreenTemplate/ScreenTemplate"
import ServiceNodeList from "components/ServiceNodeList/ServiceNodeList"
import { axiosAPI2 } from "utils/axios"
import { ENDPOINT_APPOINTMENTS } from "constants/endpoints"
import Toast from 'react-native-simple-toast'
import { useSelector } from "react-redux"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { dateToDayMonthYearFormatter } from "utils/formatters"
import Loadable, { loadableStatus } from "components/Elements/Loadable/Loadable"
import { LoadingIcon, ReloadIcon } from "components/Elements/Icons/Index"
import { Color } from "global/styles/constants"
import globalStyles from "global/styles/styles"
import ModalWindow from "components/Elements/ModalWindow/ModalWindow"
import Button from "components/Elements/Button/Button"
import { useNavigation } from "@react-navigation/native"
import { Screen } from "components/AppNavigation/AppNavigation"

const ServiceRecordsContainer = () => {

    const [orders, setOrders] = useState([])
    const [ordersLoadingStatus, setOrdersLoadingStatus] = useState(loadableStatus.LOADING)
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(null)
    const [isShowModal, setIsShowModal] = useState(false)
    const navigation = useNavigation()

    const token = useSelector(state => state.user.authToken)
    useEffect(() => {
        getOrders()
    }, [])

    const getOrders = async () => {
        setSelectedOrderIndex(null)
        setOrdersLoadingStatus(loadableStatus.LOADING)
        axiosAPI2.get(ENDPOINT_APPOINTMENTS,
            {
                headers: createAuthorizationHeader(token)
            })
            .then(res => {
                if (res.data.success) {
                    const ordersInfo = res.data.data
                    const data = []
                    if (ordersInfo) {
                        ordersInfo.forEach(el => {
                            const master = {
                                id: el.master.id,
                                name: el.master.fio.first_name,
                                surname: el.master.fio.second_name,
                                patronymic: el.master.fio.third_name
                            }
                            const service = el.service
                            const [date, time] = el.date
                                .match(/([\w | \-]*)T([\w | \:]*):00Z/)
                                .slice(1)
                            data.push({
                                id: el.id,
                                orderId: el.order_id,
                                master,
                                service,
                                date: dateToDayMonthYearFormatter(date),
                                time
                            })
                        })
                        setOrders(data)
                    }
                    setOrdersLoadingStatus(loadableStatus.SUCCESS)
                }
            }).catch(err => {
                setOrdersLoadingStatus(loadableStatus.FAIL)
                Toast.show("Не удалось загрузить записи")
            })
    }

    const onNodePress = (index) => {
        setSelectedOrderIndex(index)
    }

    const onRemoveNodePress = (index) => {
        setSelectedOrderIndex(index)
        setIsShowModal(true)
    }

    const onRemoveNodeConfirm = () => {
        console.log('Удоляемс')
    }

    const onGoToMainScreenButtonPress = () => {
        navigation.navigate(Screen.Home)
    }

    const onSignForServiceButtonPress = () => {
        navigation.navigate(Screen.SigningForServices)
    }

    return (
        <ScreenTemplate>
            <ModalWindow
                isShowing={isShowModal}
                setIshowing={setIsShowModal}
            >
                <View>
                    <Text
                        style={[
                            globalStyles.title,
                            globalStyles.centeredElement,
                            { color: Color.Black }
                        ]}
                    >
                        Вы уверены, что хотите отменить запись?
                    </Text>
                    <View
                        style={styles.modalButtonContainer}
                    >
                        <Button
                            title="Да"
                            size="small"
                            onPress={onRemoveNodeConfirm}
                        />
                        <Button
                            title="Нет"
                            size="small"
                            onPress={() => setIsShowModal(false)}
                        />
                    </View>
                </View>
            </ModalWindow>
            <View>
                <Text
                    style={globalStyles.page_title}
                >
                    Ваши записи
                </Text>
            </View>
            <Loadable
                status={ordersLoadingStatus}
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
                                styles.buttonContainer
                            ]}
                        >
                            <TouchableOpacity
                                onPress={getOrders}
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
                                title="Вернуться на главную"
                                size="large"
                                onPress={onGoToMainScreenButtonPress}
                            />
                        </View>
                    </View>
                }
            >
                {orders.length > 0 ? (
                    <>
                        <ServiceNodeList
                            services={orders}
                            onNodePress={onNodePress}
                            onRemoveNodePress={onRemoveNodePress}
                            style={styles.serviceListContainer}
                        />
                        <View
                            style={styles.serviceInfoContainer}
                        >
                            <Text
                                style={globalStyles.title}
                            >
                                Информация об услуге:
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
                                            Описание:
                                        </Text>
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                styles.serviceInfoText
                                            ]}
                                        >
                                            {orders[selectedOrderIndex].service.description}
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
                                                orders[selectedOrderIndex].master.surname,
                                                orders[selectedOrderIndex].master.name,
                                                orders[selectedOrderIndex].master.patronymic
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
                                    Выберите услугу
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
                            У вас ещё нет записей
                        </Text>
                        <View
                            style={[
                                styles.buttonContainer,
                                globalStyles.centeredElement,
                            ]}
                        >
                            <Button
                                title="Записаться"
                                onPress={onSignForServiceButtonPress}
                            />
                        </View>
                        <View
                            style={[
                                styles.buttonContainer,
                                globalStyles.centeredElement,
                            ]}
                        >
                            <Button
                                title="Вернуться на главную"
                                size="large"
                                onPress={onGoToMainScreenButtonPress}
                            />
                        </View>
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

export default ServiceRecordsContainer