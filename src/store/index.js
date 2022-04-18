import React from "react"
import { Provider } from "react-redux"
import { combineReducers } from "redux"
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "store/reducers/userSlice"

const mainReducer = combineReducers({
    user: userReducer,
})
const store = configureStore({
    reducer: mainReducer,
})

const StoreWrapper = ({children}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default StoreWrapper