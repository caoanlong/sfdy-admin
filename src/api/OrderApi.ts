
import request from '../utils/request'


export type OrderFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    platform?: number,
    orderNo?: string,
    type?: number,
    status?: number,
    memberId?: number,
    vipId?: number
}

class OrderApi {
    static url = '/order'

    static findList(params?: OrderFindListParams) {
        return request({
            url: this.url + '/findList',
            params
        })
    }
    static findById(params: { orderId?: number }) {
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
}

export default OrderApi