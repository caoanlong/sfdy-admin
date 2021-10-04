
import request from '../utils/request'


export type PostFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    title?: string
}

class PostApi {
    static url = '/post'

    static findAll() {
        return request({
            url: this.url + '/findAll'
        })
    }

    static findList(params?: PostFindListParams) {
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
    static add(data: FormData) {
        return request({
            url: this.url + '/add',
            method: 'post',
            data,
            headers: { 'Content-type': 'multipart/form-data;charset=UTF-8' }
        })
    }
    static update(data: FormData) {
        return request({
            url: this.url + '/update',
            method: 'post',
            data,
            headers: { 'Content-type': 'multipart/form-data;charset=UTF-8' }
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

export default PostApi