import { ENDPOINT_STYLES } from "constants/endpoints"
import React, { createContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { axiosAPI2 } from "utils/axios"
import {merge} from 'lodash'
import globalStyles from "./styles"

export const GlobalStylesContext = createContext(globalStyles)

const GlobalStylesWrapper = ({children}) => {
    const [styles, setStyles] = useState(globalStyles)
    const userInfo = useSelector(userSelector)

    useEffect(() => {
        if (userInfo.authToken !== '')
            getStyles()
    }, [userInfo?.authToken])

    const getStyles = () => {
        axiosAPI2.get(ENDPOINT_STYLES, 
            {
                headers: createAuthorizationHeader(userInfo.authToken)
            })
            .then(res => {
                if (res.data.success) {
                    if (res.data.data) {
                        const styles =
                            res.data.data.reduce((prev, cur) => {
                                return {
                                    ...prev,
                                    [cur.tag]: cur.object
                                }
                            }, {})
                        parseNumbers(styles)

                        const newStyles = {}
                        merge(newStyles, globalStyles, styles)
                        setStyles(newStyles)
                    }
                }
                else {
                    console.log(res.data.data.message)
                }
            })
            .catch(err => {
                console.log("Не удалось получить стили " + err)
            })
    }

    const parseNumbers = (obj) => {
        for (let field in obj) {
            if (!obj.hasOwnProperty(field)) continue
            if (typeof obj[field] === 'object') {
                obj[field] = parseNumbers(obj[field])
                continue
            }
            if (obj[field].match(/^\d*.?\d*$/)) { 
                obj[field] = Number(obj[field])
            }
        }
        return obj
    }

    return(
        <GlobalStylesContext.Provider
            value={styles}
        >
            {children}
        </GlobalStylesContext.Provider>
    )
}

export default GlobalStylesWrapper