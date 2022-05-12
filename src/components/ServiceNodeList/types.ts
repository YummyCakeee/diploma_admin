export type serviceNodeType = {
    id?: string,
    orderId?: string
    master: masterType,
    service: serviceType,
    date: string,
    time: string
}

export type masterType = {
    id: string,
    name: string,
    surname?: string,
    patronymic?: string,
    services?: number[],
    servicesFormatted?: string
}

export type serviceType = {
    id: string,
    name: string,
    masters?: number[],
    mastersFormatted?: string,
    price: string,
    duration: string,
    description?: string
}