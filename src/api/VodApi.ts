import { throttle } from 'lodash-decorators'
import request from '../utils/request'


export type VodFindListParams = {
    pageIndex?: number, 
    pageSize?: number
}

class Vod {
    static url = '/vod'

    static findList(params?: VodFindListParams) {
        return request({
            url: this.url + '/findList',
            params
        })
    }
}

export default Vod