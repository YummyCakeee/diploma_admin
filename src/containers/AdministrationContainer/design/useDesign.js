import { axiosAPI2 } from "utils/axios"
import Toast from 'react-native-simple-toast'
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { createStyleEndpoint } from "utils/apiHelpers/endpointGenerators"


const useDesign = () => {

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
        axiosAPI2.get(createStyleEndpoint(tag), 
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
                    console.log(err)
                    Toast.show("Ошибка: не удалось загрузить стили")
                }
            })
    }

    const setStylesInfo = async (
        tag,
        styles,
        onSuccessResult = (res) => { },
        onUnsuccessResult,
        onRequestFail
    ) => {
        const data = {
            tag: tag,
            object: styles
        }
        axiosAPI2.put(createStyleEndpoint(tag),
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
                        Toast.show("Ошибка: не удалось сохранить стили: " + res.data.data.message)
                    }
                }
            })
            .catch(err => {
                if (typeof (onRequestFail) === 'function') {
                    onRequestFail(err)
                }
                else {
                    console.log(err)
                    Toast.show("Ошибка: не удалось сохранить стили")
                }
            })
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
        styleNames
    }
}


export default useDesign