import request from '../utils/request'


export type BannerFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    bannerName?: string
}

class Banner {
    static url = '/banner'

    static findList(params?: BannerFindListParams) {
        return request({
            url: this.url + '/findList',
            params
        })
    }
    static del(data: { bannerId: number }) {
        return request({
            url: this.url + '/del',
            method: 'post',
            data
        })
    }
}

export default Banner