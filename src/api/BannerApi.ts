
import request from '../utils/request'


export type BannerFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    bannerName?: string,
    platform?: number
}

class BannerApi {
    static url = '/banner'

    static findList(params?: BannerFindListParams) {
        return request({
            url: this.url + '/findList',
            params
        })
    }
    static findById(params: { bannerId?: number }) {
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
            headers: { 'Content-type': 'multipart/form-data;charset=UTF-8' },
        })
    }
    static del(data: { bannerId?: number }) {
        return request({
            url: this.url + '/del',
            method: 'post',
            data
        })
    }
}

export default BannerApi