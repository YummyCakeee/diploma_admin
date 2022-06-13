import {
    ENDPOINT_MASTERS,
    ENDPOINT_SERVICES,
    ENDPOINT_APPOINTMENTS,
    ENDPOINT_CHATS,
    ENDPOINT_CLIENTS,
    ENDPOINT_ADMINS,
    ENDPOINT_STYLES,
    ENDPOINT_CONTENT,
} from "constants/endpoints"

export const createServiceEndpoint = (serviceId) =>
    `${ENDPOINT_SERVICES}/${serviceId}`

export const createServicesAvailableTimeEndpoint = (serviceId) =>
    `${createServiceEndpoint(serviceId)}/available_time`

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

export const createStyleEndpoint = (styleTag) => 
    `${ENDPOINT_STYLES}/${styleTag}`

export const createContentEndpoint = (contentTag) => 
    `${ENDPOINT_CONTENT}/${contentTag}`