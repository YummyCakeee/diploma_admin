import { ENDPOINT_ALL_MASTERS, ENDPOINT_ALL_SERVICES } from "constants/endpoints"

export const getMastersWorkTimeEndpoint = (masterID) => {
    return `${ENDPOINT_ALL_MASTERS}/${masterID}/work_time`
}

export const getServicesAvailableTimeEndpoint = (serviceID) => {
    return `${ENDPOINT_ALL_SERVICES}/${serviceID}/available_time`
}