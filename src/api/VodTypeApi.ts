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

    static del(data: { typeId: number }) {
        return request({
            url: this.url + '/del',
            method: 'post',
            data
        })
    }
}

export default VodTypeApi