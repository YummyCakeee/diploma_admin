import { useState } from "react"
import { axiosAPI2 } from "utils/axios"
import Toast from 'react-native-simple-toast'
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { createContentEndpoint } from "utils/apiHelpers/endpointGenerators"


const useContent = () => {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    const userInfo = useSelector(userSelector)
    const contentNames = {
        headerTitle: 'headerTitle',
    }

    const getContentInfo = async (
        tag,
        onSuccessResult = (res) => { },
        onUnsuccessResult,
        onRequestFail
    ) => {
        setIsLoading(true)
        await axiosAPI2.get(createContentEndpoint(tag), 
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
                        Toast.show("Не удалось загрузить контент: " + res.data.data.message)
                    }
                }
            })
            .catch(err => {
                if (typeof (onRequestFail) === 'function') {
                    onRequestFail(err)
                }
                else {
                    Toast.show("Ошибка: не удалось загрузить контент")
                }
            })
        setIsLoading(false)
    }

    const setContentInfo = async (
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
        await axiosAPI2.put(createContentEndpoint(tag),
            data,
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
                        Toast.show("Не удалось сохранить контент: " + res.data.data.message)
                    }
                }
            })
            .catch(err => {
                if (typeof (onRequestFail) === 'function') {
                    onRequestFail(err)
                }
                else {
                    Toast.show("Ошибка: не удалось сохранить контент")
                }
            })
        setIsSubmitting(false)
    }

    const resetContentInfo = async (
        tag,
        onSuccessResult = (res) => {},
        onUnsuccessResult,
        onRequestFail
    ) => {
        setContentInfo(tag, {}, onSuccessResult, onUnsuccessResult, onRequestFail)
    }

    return {
        getContentInfo,
        setContentInfo,
        resetContentInfo,
        isLoading,
        setIsLoading,
        isSubmitting,
        setIsLoading,
        contentNames
    }
}


export default useContent