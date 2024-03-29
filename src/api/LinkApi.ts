
import request from '../utils/request'


export type LinkFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    linkName?: string,
    platform?: number
}

class LinkApi {
    static url = '/link'

    static findList(params?: LinkFindListParams) {
        return request({
            url: this.url + '/findList',
            params
        })
    }
    static findById(params: { linkId?: number }) {
        return request({
            url: this.url + '/findById',
            params
        })
    }
    static add(data: FormData) {
        return request({
            url: this.url + '/add',
            method: 'post',
            data
        })
    }
    static update(data: FormData) {
        return request({
            url: this.url + '/update',
            method: 'post',
            data
        })
    }
    static del(data: { linkId?: number }) {
        return request({
            url: this.url + '/del',
            method: 'post',
            data
        })
    }
}

export default LinkApi