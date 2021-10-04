
import { TagItem } from '../types'
import request from '../utils/request'


export type TagFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    name?: string
}

class TagApi {
    static url = '/tag'

    static findAll() {
        return request({
            url: this.url + '/findAll'
        })
    }

    static findList(params?: TagFindListParams) {
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
    static add(data: TagItem) {
        return request({
            url: this.url + '/add',
            method: 'post',
            data
        })
    }
    static update(data: TagItem) {
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

export default TagApi