
import { Province } from '../types'
import request from '../utils/request'


export type ProvinceFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    name?: string
}

class ProvinceApi {
    static url = '/province'

    static findAll() {
        return request({
            url: this.url + '/findAll'
        })
    }

    static findList(params?: ProvinceFindListParams) {
        return request({
            url: this.url + '/findList',
            params
        })
    }
    static findById(params: { id: number }) {
        return request({
            url: this.url + '/findById',
            params
        })
    }
    static add(data: Province) {
        return request({
            url: this.url + '/add',
            method: 'post',
            data
        })
    }
    static update(data: Province) {
        return request({
            url: this.url + '/update',
            method: 'post',
            data
        })
    }
    static del(data: { id: number }) {
        return request({
            url: this.url + '/del',
            method: 'post',
            data
        })
    }
}

export default ProvinceApi