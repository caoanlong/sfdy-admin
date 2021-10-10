
import { Money } from '../types'
import request from '../utils/request'


export type MoneyFindListParams = {
    pageIndex?: number, 
    pageSize?: number
}

class MoneyApi {
    static url = '/money'

    static findAll() {
        return request({
            url: this.url + '/findAll'
        })
    }

    static findList(params?: MoneyFindListParams) {
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
    static add(data: Money) {
        return request({
            url: this.url + '/add',
            method: 'post',
            data
        })
    }
    static update(data: Money) {
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

export default MoneyApi