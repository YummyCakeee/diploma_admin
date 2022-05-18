import { Reducer, AnyAction } from "@reduxjs/toolkit"
import userType from "store/types/user"
import * as actionTypes from "store/constants/user"
import produce from "immer"

const userInitialState: userType = {
    id: '',
    authToken: '',
    refreshToken: '',
    surname: '',
    name: '',
    patronymic: '',
    phone: '',
    email: '',
}

const userReducer: Reducer<userType> = (
    state: userType = userInitialState,
    action: AnyAction
) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case actionTypes.USER_UPDATE:
                return { ...draft, ...action.payload }
            case actionTypes.USER_FULL_UPDATE:
                return action.payload
            case actionTypes.USER_CLEAR:
                return userInitialState
            default:
                return state
        }
    })
}

export default userReducer