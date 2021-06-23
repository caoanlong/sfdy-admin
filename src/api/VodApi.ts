import { throttle } from 'lodash-decorators'
import request from '../utils/request'


export type VodFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    vodName?: string,
    typeId?: number,
    vodClass?: string
}

class Vod {
    static url = '/vod'

    static findList(params?: VodFindListParams) {
        return request({
            url: this.url + '/findList',
            params
        })
    }
    static del(data: { vodId: number }) {
        return request({
            url: this.url + '/del',
            method: 'post',
            data
        })
    }
}

export default Vod