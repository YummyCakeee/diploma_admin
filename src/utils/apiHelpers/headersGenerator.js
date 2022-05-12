export const createAuthorizationHeader = (token) => {
    return { Authorization: `Bearer ${token}`}
}

export const composeHeaders = (...headers) => {
    let header = {}
    headers.forEach(el => {
        header = {...header, ...el}
    })

    return header
}