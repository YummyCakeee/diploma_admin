import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import { useDispatch, useSelector } from "react-redux";
import { phoneNumberFormatter, simplePhoneNumberFormatter } from "utils/formatters";
import { axiosAPI2 } from "utils/axios";
import { ENDPOINT_USER } from "constants/endpoints";
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator";
import Toast from 'react-native-simple-toast'
import { clearUser, updateUser } from "store/actions/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userSelector } from "store/selectors/userSlice";

const useSettings = () => {
    const [initialValues, setInitialValues] = useState({})
    const [extraInitialValues, setExtraInitialValues] = useState({})
    const [sendCodeRemainingTime, setSendCodeRemainingTime] = useState(90)
    const [isShowModal, setIsShowModal] = useState(false)
    const navigation = useNavigation()
    const userData = useSelector(userSelector)
    const dispatch = useDispatch()

    useEffect(() => {
        setInitialValues({
            name: userData.name,
            surname: userData.surname,
            patronymic: userData.patronymic,
            phone: phoneNumberFormatter(userData.phone),
            email: userData.email
        })
    }, [userData])

    useEffect(() => {
        setExtraInitialValues({
            newPhone: ''
        })
    }, [])


    const onSignOut = async () => {
        dispatch(clearUser())
        await AsyncStorage.setItem('authToken', "")
        await AsyncStorage.setItem('refreshToken', "")
        navigation.reset({
            index: 0,
            routes: [{ name: 'Registration' }]
        })
    }

    const onSubmit = (values) => {
        const fieldsMap = new Map([
            ['name', 'first_name'],
            ['surname', 'second_name'],
            ['patronymic', 'third_name'],
            ['first_name', 'name'],
            ['second_name', 'surname'],
            ['third_name', 'patronymic'],
            ['phone', 'phone'],
            ['email', 'email'],
            ['password', 'password']
        ])
        if (!isShowModal) {
            const data = {}
            Object.keys(values).forEach(key => {
                if (values[key] !== initialValues[key])
                    data[fieldsMap.get(key)] = values[key]
            })
            if (data.phone) data.phone = simplePhoneNumberFormatter(data.phone)
            axiosAPI2.put(ENDPOINT_USER,
                data,
                {
                    headers: createAuthorizationHeader(userData.authToken)
                }).then(res => {
                    if (res.data.success) {
                        const updatedValues = {}
                        const fields = res.data.data.fields
                        if (fields) {
                            fields.forEach(el => {
                                updatedValues[fieldsMap.get(el)] = values[fieldsMap.get(el)]
                            })
                            dispatch(updateUser(updatedValues))
                        }
                        if (res.data.data.required_code) {
                            values.code = ''
                            setExtraInitialValues({
                                newPhone: values.phone
                            })
                            values.phone = initialValues.phone
                            setIsShowModal(true)
                            if (res.data.data.remaining_time)
                                setSendCodeRemainingTime(res.data.data.remaining_time)
                            if (fields) 
                                Toast.show("Некоторые данные обновлены")
                        } else {
                            Toast.show("Данные обновлены")
                        }
                    } else {
                        if (res.data.data.remaining_time) {
                            Toast.show(`Код уже был отправлен на номер ${values.newPhone}`)
                            values.code = ''
                            setIsShowModal(true)
                            setSendCodeRemainingTime(res.data.data.remaining_time)
                        }
                    }
                }).catch(err => {
                    Toast.show("Произошла ошибка при обновлении данных")
                })
        }
        else {
            const data = {
                code: Number(values.code)
            }
            axiosAPI2.put(ENDPOINT_USER,
                data,
                {
                    headers: createAuthorizationHeader(userData.authToken)
                }).then(res => {
                    if (res.data.success) {
                        const updatedValues = {}
                        res.data.data.fields?.forEach(el => {
                            updatedValues[fieldsMap.get(el)] = values[fieldsMap.get(el)]
                        })
                        if (updatedValues.phone) {
                            updatedValues.phone = values.newPhone
                        }
                        delete updatedValues.password
                        values.password = ''
                        console.log(updatedValues)
                        dispatch(updateUser(updatedValues))
                        Toast.show("Данные обновлены")
                        setIsShowModal(false)
                    }
                    else {
                        Toast.show(res.data.message)
                    }
                }).catch(err => {
                    Toast.show("Произошла ошибка при обновлении данных")
                })
        }
    }

    return {
        initialValues,
        extraInitialValues,
        sendCodeRemainingTime,
        isShowModal,
        setIsShowModal,
        onSignOut,
        onSubmit
    }
}

export default useSettings