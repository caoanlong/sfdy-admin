import { VodType } from '../types'
import request from '../utils/request'


export type VodTypeFindListParams = {
    pageIndex?: number, 
    pageSize?: number
}

class VodTypeApi {
    static url = '/vodType'

    static findAll() {
        return request({
            url: this.url + '/findAll'
        })
    }

    static findById(params: { typeId?: number }) {
        return request({
            url: this.url + '/findById',
            params
        })
    }

    static update(data: VodType) {
        return request({
            url: this.url + '/update',
            method: 'post',
            data
        })
    }

    static del(data: { typeId: number }) {
        return request({
            url: this.url + '/del',
            method: 'post',
            data
        })
    }
}

export default VodTypeApi