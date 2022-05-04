import React from "react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "store/reducers/userSlice"


export const store = configureStore({
    reducer: {
        user: userReducer,
    }
})

const StoreWrapper = ({children}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default StoreWrapper