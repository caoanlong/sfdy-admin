
import request from '../utils/request'


export type MemberFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    memberName?: string,
    mobile?: string,
    email?: string,
    isAgent?: number,
    status?: number,
    regType?: number
}

class MemberApi {
    static url = '/member'

    static findList(params?: MemberFindListParams) {
        return request({
            url: this.url + '/findList',
            params
        })
    }
    static findById(params: { memberId?: number }) {
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
            headers: { 'Content-type': 'multipart/form-data;charset=UTF-8' },
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
    static del(data: { memberId?: number }) {
        return request({
            url: this.url + '/del',
            method: 'post',
            data
        })
    }
}

export default MemberApi