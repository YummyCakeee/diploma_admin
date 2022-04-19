import * as actionTypes from "store/constants/user"
import axiosAPI from "utils/axios"
import { ENDPOINT_USER_UPDATE } from "constants/endpoints"
import { ThunkDispatch, AnyAction } from "@reduxjs/toolkit"
import stateType from "store/types"
import userType from "store/types/user"

export const requestUser = (
    token: string
) => async (
    dispatch: ThunkDispatch<stateType, void, AnyAction>,
    getState: () => stateType
    ) => {
        const fd = new FormData()
        fd.append('token', token)
        await axiosAPI.post(ENDPOINT_USER_UPDATE, fd).then(
            res => {
                dispatch(userLoaded(res.data))
            })
    }

export const userLoaded = (
    user: userType
) => ({
    type: actionTypes.USER_FULL_UPDATE,
    payload: user
})