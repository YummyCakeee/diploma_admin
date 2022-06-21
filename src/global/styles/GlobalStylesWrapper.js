import React, { createContext, useEffect, useState } from "react"
import globalStyles from "./styles"

export const GlobalStylesContext = createContext(globalStyles)

const GlobalStylesWrapper = ({children}) => {
    const [styles, setStyles] = useState(globalStyles)

    useEffect(() => {
        setStyles(globalStyles)
    }, [])

    return(
        <GlobalStylesContext.Provider
            value={styles}
        >
            {children}
        </GlobalStylesContext.Provider>
    )
}

export default GlobalStylesWrapper