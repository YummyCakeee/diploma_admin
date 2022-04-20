import axios from "axios";

const url = 'https://pure-mesa-74041.herokuapp.com'

const createHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': '',
    }

    return headers
}

export const createAxiosInstance = (req) => {
    const host = 'pure-mesa-74041.herokuapp.com'
    const instance = axios.create({
        baseURL: url, 
        withCredentials: true,
        headers: createHeaders(),
    })
    instance.defaults.headers.common['Host'] = host

    return instance
}

export const headers = createHeaders()
export const axiosAPI = createAxiosInstance()
export default axiosAPI