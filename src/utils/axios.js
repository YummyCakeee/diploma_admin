import axios from "axios";


export const createAxiosInstance = (req) => {
    const url = 'https://pure-mesa-74041.herokuapp.com'
    const host = url.match(/https:\/\/([\w | \- | \.]*)/)[1]
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': '',
    }
    const instance = axios.create({
        baseURL: url, 
        withCredentials: true,
        headers,
    })
    instance.defaults.headers.common['Host'] = host

    return instance
}

const axiosAPI = createAxiosInstance()
export default axiosAPI


// Temp


export const createAxiosInstance2 = (req) => {
    const url = 'https://pure-beach-58958.herokuapp.com'
    const host = url.match(/https:\/\/([\w | \- | \.]*)/)[1]
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': '',
    }
    const instance = axios.create({
        baseURL: url, 
        withCredentials: true,
        headers,
    })
    instance.defaults.headers.common['Host'] = host

    return instance
}

export const axiosAPI2 = createAxiosInstance2()