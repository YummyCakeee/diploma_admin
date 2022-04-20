import { Reducer, AnyAction } from "@reduxjs/toolkit"
import userType from "store/types/user"
import * as actionTypes from "store/constants/user"
import produce from "immer"

const initialState: userType = {
    authToken: '',
    refreshToken: '',
    surname: '',
    name: '',
    patronymic: '',
    phone: '',
    email: '',
    token: ''
}

const userReducer: Reducer<userType> = (
    state: userType = initialState,
    action: AnyAction
) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case actionTypes.USER_UPDATE:
                return { ...draft, ...action.payload }
            case actionTypes.USER_FULL_UPDATE:
                return action.payload
            default:
                return state
        }
    })
}

export default userReducer