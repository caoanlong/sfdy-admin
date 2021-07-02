import request from '../utils/request'


export type VodFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    vodName?: string,
    typeId?: number,
    vodClass?: string,
    status?: number
}

class VodApi {
    static url = '/vod'

    static findList(params?: VodFindListParams) {
        return request({
            url: this.url + '/findList',
            params
        })
    }

    static findById(params: { vodId?: number }) {
        return request({
            url: this.url + '/findById',
            params
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
    
    static del(data: { vodId: number }) {
        return request({
            url: this.url + '/del',
            method: 'post',
            data
        })
    }

    static delUnPlay() {
        return request({
            url: this.url + '/delUnPlay',
            method: 'post'
        })
    }
}

export default VodApi