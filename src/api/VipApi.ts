
import request from '../utils/request'


export type VipFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    vipName?: string
}

class VipApi {
    static url = '/vip'

    static findList(params?: VipFindListParams) {
        return request({
            url: this.url + '/findList',
            params
        })
    }
    static findById(params: { vipId?: number }) {
        return request({
            url: this.url + '/findById',
            params
        })
    }
    static add(data: FormData) {
        return request({
            url: this.url + '/add',
            method: 'post',
            data,
            headers: { 'Content-type': 'multipart/form-data;charset=UTF-8' }
        })
    }
    static update(data: FormData) {
        return request({
            url: this.url + '/update',
            method: 'post',
            data,
            headers: { 'Content-type': 'multipart/form-data;charset=UTF-8' },
        })
    }
    static del(data: { vipId?: number }) {
        return request({
            url: this.url + '/del',
            method: 'post',
            data
        })
    }
}

export default VipApi