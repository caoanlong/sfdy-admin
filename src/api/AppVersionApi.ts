
import { AppVersion } from '../types'
import request from '../utils/request'


export type AppVersionFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    appId?: string,
    device?: number,
    platform?: number
}

class AppVersionApi {
    static url = '/appVersion'

    static findList(params?: AppVersionFindListParams) {
        return request({
            url: this.url + '/findList',
            params
        })
    }
    static findById(params: { id?: number }) {
        return request({
            url: this.url + '/findById',
            params
        })
    }
    static add(data: AppVersion) {
        return request({
            url: this.url + '/add',
            method: 'post',
            data
        })
    }
    static update(data: AppVersion) {
        return request({
            url: this.url + '/update',
            method: 'post',
            data
        })
    }
    static del(data: { id?: number }) {
        return request({
            url: this.url + '/del',
            method: 'post',
            data
        })
    }
}

export default AppVersionApi