import axios from "axios";

const url = 'https://jsonplaceholder.typicode.com'


export const createAxiosInstance = () => {
    const instance = axios.create({baseURL: url})
    return instance
}

export const axiosAPI = createAxiosInstance()

export default axiosAPI