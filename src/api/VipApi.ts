
import { Vip } from '../types'
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
    static findAll() {
        return request({
            url: this.url + '/findAll'
        })
    }
    static add(data: Vip) {
        return request({
            url: this.url + '/add',
            method: 'post',
            data
        })
    }
    static update(data: Vip) {
        return request({
            url: this.url + '/update',
            method: 'post',
            data
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