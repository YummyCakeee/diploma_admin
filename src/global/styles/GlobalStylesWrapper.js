import React, { createContext, useEffect, useState } from "react"
import globalStyles from "./styles"

export const GlobalStylesContext = createContext()

const GlobalStylesWrapper = ({children}) => {

    const [styles, setStyles] = useState(globalStyles)

    useEffect(() => {
        setTimeout(() => {
            const newStyles = {
                ...globalStyles,
                ...{
                    header: {
                        container: {
                            backgroundColor: 'red'
                        }
                    }
                }
            }
            setStyles(newStyles)
        }, 5000);
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