import {
    ENDPOINT_MASTERS,
    ENDPOINT_SERVICES,
    ENDPOINT_APPOINTMENTS,
    ENDPOINT_CHATS,
    ENDPOINT_CLIENTS,
    ENDPOINT_ADMINS,
} from "constants/endpoints"


export const createServicesAvailableTimeEndpoint = (serviceId) =>
    `${ENDPOINT_SERVICES}/${serviceId}/available_time`

export const createAppointmentIdEndpoint = (appointmentId) =>
    `${ENDPOINT_APPOINTMENTS}/${appointmentId}`

export const createChatRoomEndpoint = (roomId) =>
    `${ENDPOINT_CHATS}/${roomId}`

export const createMasterEndpoint = (masterId) =>
    `${ENDPOINT_MASTERS}/${masterId}`

export const createClientEndpoint = (clientId) =>
    `${ENDPOINT_CLIENTS}/${clientId}`

export const createAdminEndpoint = (adminId) =>
    `${ENDPOINT_ADMINS}/${adminId}`

export const createMastersWorkTimeEndpoint = (masterId) =>
    `${createMasterEndpoint(masterId)}/work_time`