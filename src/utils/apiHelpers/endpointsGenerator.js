import { ENDPOINT_ALL_MASTERS, ENDPOINT_ALL_SERVICES } from "constants/endpoints"

export const createMastersWorkTimeEndpoint = (masterID) => {
    return `${ENDPOINT_ALL_MASTERS}/${masterID}/work_time`
}

export const createServicesAvailableTimeEndpoint = (serviceID) => {
    return `${ENDPOINT_ALL_SERVICES}/${serviceID}/available_time`
}