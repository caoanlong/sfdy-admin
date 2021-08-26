import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'
import { store } from '../store'
import { setToken, setUserInfo } from '../store/actions'

const baseURL = '/boss'
const service = axios.create({
    baseURL,
    timeout: 15000
})

service.interceptors.request.use((config: AxiosRequestConfig) => {
    const state = store.getState()
    if (state.user.token) {
        config.headers['Authorization'] = 'Bearer ' + state.user.token
    }
    return config
})

service.interceptors.response.use((res: AxiosResponse) => {
    if (res.data.code !== 200) {
        if ([403, 1001].includes(res.data.code)) {
            message.error(res.data.message)
            store.dispatch(setToken(''))
            store.dispatch(setUserInfo({}))
            return Promise.reject(res)
        }
        message.error(res.data.message)
        return Promise.reject(res)
    }
    return res
}, (err: AxiosError) => {
    console.log(err.response?.status)
    if (err.response?.status === 401) {
        store.dispatch(setToken(''))
        store.dispatch(setUserInfo({}))
    }
    message.error(err.response?.statusText)
    return Promise.reject(err)
})

export default service