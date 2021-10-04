
import { City } from '../types'
import request from '../utils/request'


export type CityFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    name?: string
}

class CityApi {
    static url = '/city'

    static findAll(params: { pId: number }) {
        return request({
            url: this.url + '/findAll',
            params
        })
    }

    static findList(params?: CityFindListParams) {
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
    static add(data: City) {
        return request({
            url: this.url + '/add',
            method: 'post',
            data
        })
    }
    static update(data: City) {
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

export default CityApi