import { throttle } from 'lodash-decorators'
import request from '../utils/request'

class Admin {
    static url = '/admin'

    @throttle(1000)
    static login(data: { adminName: string, adminPwd: string }) {
        return request({
            url: this.url + '/login',
            method: 'post',
            data
        })
    }

    static getUserInfo() {
        return request({ url: this.url + '/userInfo '})
    }
}

export default Admin