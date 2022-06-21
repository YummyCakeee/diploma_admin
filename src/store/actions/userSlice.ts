import * as actionTypes from "store/constants/user"
import userType from "store/types/user"

export const userLoaded = (
    user: userType
) => ({
    type: actionTypes.USER_FULL_UPDATE,
    payload: user
})

export const updateUser = (user: userType) => ({
    type: actionTypes.USER_UPDATE,
    payload: user
})

export const clearUser = () => ({
    type: actionTypes.USER_CLEAR
})