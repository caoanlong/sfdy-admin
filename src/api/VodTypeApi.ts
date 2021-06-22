import { throttle } from 'lodash-decorators'
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
}

export default VodTypeApi