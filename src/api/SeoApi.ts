import { Seo } from '../types'
import request from '../utils/request'

class SeoApi {
    static url = '/seo'

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
}

export default SeoApi