import { throttle } from 'lodash-decorators'
import request from '../utils/request'


export type AdminFindListParams = {
    pageIndex?: number, 
    pageSize?: number, 
    adminStatus?: number | string, 
    adminName?: string
}

class AdminApi {
    static url = '/admin'

    @throttle(1000)
    static login(data: { adminName: string, adminPwd: string }) {
        return request({
            url: this.url + '/login',
            method: 'post',
            data
        })
    }

    static getUserInfo() {
        return request({ url: this.url + '/userInfo '})
    }

    static findList(params?: AdminFindListParams) {
        return request({
            url: this.url + '/findList',
            params
        })
    }
}

export default AdminApi