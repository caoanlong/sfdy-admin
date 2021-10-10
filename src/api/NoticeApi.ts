
import { Notice } from '../types'
import request from '../utils/request'


export type NoticeFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    platform?: number
}

class NoticeApi {
    static url = '/notice'

    static findAll() {
        return request({
            url: this.url + '/findAll'
        })
    }

    static findList(params?: NoticeFindListParams) {
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
    static add(data: Notice) {
        return request({
            url: this.url + '/add',
            method: 'post',
            data
        })
    }
    static update(data: Notice) {
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

export default NoticeApi