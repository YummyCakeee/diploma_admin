import { ENDPOINT_ALL_MASTERS, ENDPOINT_ALL_SERVICES, ENDPOINT_APPOINTMENTS } from "constants/endpoints"

export const createMastersWorkTimeEndpoint = (masterID) => 
    `${ENDPOINT_ALL_MASTERS}/${masterID}/work_time`

export const createServicesAvailableTimeEndpoint = (serviceID) => 
    `${ENDPOINT_ALL_SERVICES}/${serviceID}/available_time`

export const createAppointmentIdEndpoint = (id) => 
    `${ENDPOINT_APPOINTMENTS}/${id}`