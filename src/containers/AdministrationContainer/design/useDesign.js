import { axiosAPI2 } from "utils/axios"
import Toast from 'react-native-simple-toast'
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { createStyleEndpoint } from "utils/apiHelpers/endpointGenerators"
import { useState } from "react"


const useDesign = () => {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const userInfo = useSelector(userSelector)
    const styleNames = {
        header: 'header',
        headerTitle: 'headerTitle',
        headerMenuButton: 'headerMenuButton',
        background: 'background',
        text: 'text',
        title: 'title',
        pageTitle: 'pageTitle',
        button: 'button',
        buttonPrimary: 'buttonPrimary',
        buttonPressed: 'buttonPressed',
        buttonBlocked: 'buttonBlocked',
        drawer: 'drawer',
        drawerItem: 'drawerItem',
        drawerItemSelected: 'drawerItemSelected'
    }

    const getStylesInfo = async (
        tag,
        onSuccessResult = (res) => { },
        onUnsuccessResult,
        onRequestFail
    ) => {
        setIsLoading(true)
        await axiosAPI2.get(createStyleEndpoint(tag), 
            {
                headers: createAuthorizationHeader(userInfo.authToken),
            })
            .then(res => {
                if (res.data.success)
                    onSuccessResult(res.data)
                else {
                    if (typeof(onUnsuccessResult) === 'function'){
                        onUnsuccessResult(res.data)
                    }
                    else {
                        Toast.show("Ошибка: не удалось загрузить стили: " + res.data.data.message)
                    }
                }
            })
            .catch(err => {
                if (typeof (onRequestFail) === 'function') {
                    onRequestFail(err)
                }
                else {
                    Toast.show("Ошибка: не удалось загрузить стили")
                }
            })
        setIsLoading(false)
    }

    const setStylesInfo = async (
        tag,
        styles,
        onSuccessResult = (res) => { },
        onUnsuccessResult,
        onRequestFail
    ) => {
        setIsSubmitting(true)
        const data = {
            tag: tag,
            object: styles
        }
        await axiosAPI2.put(createStyleEndpoint(tag),
            data,
            {
                headers: createAuthorizationHeader(userInfo.authToken),
            })
            .then(res => {
                if (res.data.success)
                    onSuccessResult(res)
                else {
                    if (typeof(onUnsuccessResult) === 'function'){
                        onUnsuccessResult(res)
                    }
                    else {
                        Toast.show("Не удалось сохранить стили: " + res.data.data.message)
                    }
                }
            })
            .catch(err => {
                if (typeof (onRequestFail) === 'function') {
                    onRequestFail(err)
                }
                else {
                    Toast.show("Ошибка: не удалось сохранить стили")
                }
            })
        setIsSubmitting(false)
    }

    const resetStyleInfo = async (
        tag,
        onSuccessResult = (res) => {},
        onUnsuccessResult,
        onRequestFail
    ) => {
        setStylesInfo(tag, {}, onSuccessResult, onUnsuccessResult, onRequestFail)
    }

    return {
        getStylesInfo,
        setStylesInfo,
        resetStyleInfo,
        isLoading,
        setIsLoading,
        isSubmitting,
        setIsSubmitting,
        styleNames
    }
}


export default useDesign