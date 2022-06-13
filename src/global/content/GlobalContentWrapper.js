import { ENDPOINT_CONTENT } from "constants/endpoints"
import React, { createContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { userSelector } from "store/selectors/userSlice"
import { createAuthorizationHeader } from "utils/apiHelpers/headersGenerator"
import { axiosAPI2 } from "utils/axios"
import {merge} from 'lodash'
import globalContent from "./content"

export const GlobalContentContext = createContext()

const GlobalContentWrapper = ({children}) => {
    const [content, setContent] = useState(globalContent)
    const userInfo = useSelector(userSelector)
    useEffect(() => {
        if (userInfo.authToken !== '')
            getContent()
    }, [userInfo?.authToken])

    const getContent = () => {
        axiosAPI2.get(ENDPOINT_CONTENT, 
            {
                headers: createAuthorizationHeader(userInfo.authToken)
            })
            .then(res => {
                if (res.data.success) {
                    if (res.data.data) {
                        const content =
                            res.data.data.reduce((prev, cur) => {
                                return {
                                    ...prev,
                                    [cur.tag]: cur.object
                                }
                            }, {})
                        parseNumbers(content)

                        const newContent = {}
                        merge(newContent, globalContent, content)
                        setContent(newContent)
                    }
                }
                else {
                    console.log(res.data.data.message)
                }
            })
            .catch(err => {
                console.log("Не удалось получить контент " + err)
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
        <GlobalContentContext.Provider
            value={content}
        >
            {children}
        </GlobalContentContext.Provider>
    )
}

export default GlobalContentWrapper