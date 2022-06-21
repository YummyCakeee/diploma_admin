import React, { createContext, useEffect, useState } from "react"
import globalContent from "./content"

export const GlobalContentContext = createContext()

const GlobalContentWrapper = ({ children }) => {
    const [content, setContent] = useState(globalContent)
    useEffect(() => {
        setContent(globalContent)
    }, [])

    return (
        <GlobalContentContext.Provider
            value={content}
        >
            {children}
        </GlobalContentContext.Provider>
    )
}

export default GlobalContentWrapper