
import request from '../utils/request'

class CommonApi {
    static url = '/common'

    static upload(dir: string, data: FormData) {
        return request({
            url: this.url + `/upload/${dir}`,
            method: 'post',
            data,
            headers: { 'Content-type': 'multipart/form-data;charset=UTF-8' }
        })
    }
}

export default CommonApi