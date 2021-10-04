
import request from '../utils/request'


export type MemberFindListParams = {
    pageIndex?: number, 
    pageSize?: number,
    platform?: number,
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
    static getValidVips(params: { memberId?: number }) {
        return request({
            url: this.url + '/validVips',
            params
        })
    }
    static getVips(params: { memberId?: number }) {
        return request({
            url: this.url + '/vips',
            params
        })
    }
    static deleteMemberVip(data: { id?: number }) {
        return request({
            url: this.url + '/deleteMemberVip',
            method: 'post',
            data
        })
    }
    static addMemberVip(data: { memberId: number, vipId: number }) {
        return request({
            url: this.url + '/addMemberVip',
            method: 'post',
            data
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