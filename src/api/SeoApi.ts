import { Seo } from '../types'
import request from '../utils/request'

export type SeoFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    platform?: string
}

class SeoApi {
    static url = '/seo'

    static findList(params?: SeoFindListParams) {
        return request({
            url: this.url + '/findList',
            params
        })
    }
    static findById(params: { seoId: number }) {
        return request({
            url: this.url + '/findById',
            params
        })
    }
    static add(data: Seo) {
        return request({
            url: this.url + '/add',
            method: 'post',
            data
        })
    }

    static findSeo() {
        return request({
            url: this.url + '/findSeo'
        })
    }
    static findScript() {
        return request({
            url: this.url + '/findScript'
        })
    }
    static update(data: Seo) {
        return request({
            url: this.url + '/update',
            method: 'post',
            data
        })
    }
    static del(data: { seoId: number }) {
        return request({
            url: this.url + '/del',
            method: 'post',
            data
        })
    }
}

export default SeoApi