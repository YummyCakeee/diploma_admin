import Slider from "components/Elements/Slider/Slider"
import ScreenTemplate from "components/ScreenTemplate/ScreenTemplate"
import globalStyles from "global/styles/styles"
import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import MastersControl from "./masters/MastersControl"
import axios from "axios"
import { axiosAPI2 } from "utils/axios"
import Loadable, { loadableStatus } from "components/Elements/Loadable/Loadable"
import { LoadingIcon, ReloadIcon } from "components/Elements/Icons/Index"
import { Color } from "global/styles/constants"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import { ENDPOINT_MASTERS, ENDPOINT_SERVICES } from "constants/endpoints"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import ServicesControl from "./services/ServicesControl"

const MODE_MASTERS = 0
const MODE_SERVICES = 1
const MODE_DESIGN = 2

const AdministrationContainer = () => {

    const [masters, setMasters] = useState([])
    const [services, setServices] = useState([])
    const [modeSliderItems] = useState([
        { text: "Мастера", mode: MODE_MASTERS },
        { text: "Услуги", mode: MODE_SERVICES },
        { text: "Дизайн", mode: MODE_DESIGN }
    ])
    const [selectedMode, setSelectedMode] = useState(MODE_MASTERS)
    const [mastersAndServicesLoadingStatus, setMastersAndServicesLoadingStatus]
        = useState(loadableStatus.LOADING)

    const userInfo = useSelector(userSelector)

    useEffect(() => {
        getMastersAndServices()
    }, [])


    const getMastersAndServices = async () => {
        setMastersAndServicesLoadingStatus(loadableStatus.LOADING)
        await axios.all(
            [
                axiosAPI2.get(ENDPOINT_SERVICES, {
                    headers: createAuthorizationHeader(userInfo.authToken)
                }),
                axiosAPI2.get(ENDPOINT_MASTERS, {
                    headers: createAuthorizationHeader(userInfo.authToken)
                })
            ]
        ).then(axios.spread((servicesRes, mastersRes) => {
            let mastersData = mastersRes.data.data
            let servicesData = servicesRes.data.data
            if (mastersData.length === 0 || servicesData.length === 0)
                return
            mastersData.forEach(el => {
                el.name = el.first_name
                el.surname = el.second_name
                el.patronymic = el.third_mame
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
            setMastersAndServicesLoadingStatus(loadableStatus.SUCCESS)
        })).catch(err => {
            setMastersAndServicesLoadingStatus(loadableStatus.FAIL)
        })
    }

    return (
        <ScreenTemplate>
            <View
                style={styles.container}
            >
                <Text
                    style={globalStyles.pageTitle}
                >
                    Администрирование
                </Text>
                <Slider
                    data={modeSliderItems}
                    onItemSelected={(item) => setSelectedMode(item.mode)}
                    horizontal
                    itemComponent={({ isSelected, item }) => (
                        <Text
                            style={
                                [
                                    globalStyles.text,
                                    isSelected ?
                                        styles.sliderItemSelectedText :
                                        styles.sliderItemText
                                ]}
                        >
                            {item.text}
                        </Text >
                    )}
                />
                <View
                    style={styles.editSection}
                >
                    {selectedMode === MODE_MASTERS &&
                        <Loadable
                            status={mastersAndServicesLoadingStatus}
                            onLoadingComponent={MastersAndServicesLoading}
                            onFailComponent={() => MastersAndServicesLoadingFail(getMastersAndServices)}
                        >
                            <MastersControl
                                {...{
                                    masters,
                                    setMasters,
                                    services
                                }}
                            />
                        </Loadable>
                    }
                    {selectedMode === MODE_SERVICES &&
                        <Loadable
                            status={mastersAndServicesLoadingStatus}
                            onLoadingComponent={MastersAndServicesLoading}
                            onFailComponent={() => MastersAndServicesLoadingFail(getMastersAndServices)}
                        >
                            <ServicesControl
                                {...{
                                    masters,
                                    services,
                                    setServices
                                }}
                            />
                        </Loadable>
                    }
                </View>
            </View>
        </ScreenTemplate>
    )
}

const MastersAndServicesLoading = () => {
    return (
        <View
            style={styles.loadingContainer}
        >
            <LoadingIcon
                color={Color.LightGray}
                width={30}
                height={30}
            />
        </View>
    )
}

const MastersAndServicesLoadingFail = (onReload) => {
    return (
        <View
            style={styles.loadingContainer}
        >
            <TouchableOpacity
                onPress={onReload}
                style={styles.loadingFailIcon}
            >
                <ReloadIcon
                    color={Color.LightGray}
                    width={30}
                    height={30}
                />
            </TouchableOpacity>
            <Text
                style={[
                    globalStyles.text,
                    styles.loadingFailText
                ]}
            >
                Не удалось загрузить данные{'\n'}о мастерах и услугах
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    editSection: {
        marginTop: 10,
    },
    loadingContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    loadingFailText: {
        textAlign: 'center'
    },
    loadingFailIcon: {
        marginBottom: 10,
    },
    sliderItemText: {
        color: Color.OceanBlue,
    },
    sliderItemSelectedText: {
        color: Color.White,
    }
})

export default AdministrationContainer