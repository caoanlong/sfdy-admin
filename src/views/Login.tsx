import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setToken } from '../store/actions'
import { AppState } from '../store'
import Admin from '../api/Admin'
import { Res } from '../types'
import { AxiosResponse } from 'axios'
import { useHistory } from 'react-router'
import { useState } from 'react'


function Login() {

    const token = useSelector((state: AppState) => state.user.token)
    const dispatch = useDispatch()
    const history = useHistory()
    const [ loading, setLoading ] = useState(false)

    const onFinish = (values: any) => {
        setLoading(true)
        Admin.login({
            adminName: values.username,
            adminPwd: values.password
        }).then((res: AxiosResponse<Res<any>>) => {
            setLoading(false)
            dispatch(setToken(res.headers['authorization']))
            message.success(res.data.message)
            history.push('/')
        }).catch(err => {
            setLoading(false)
        })
    }

    return (
        <div 
            className="h-screen flex justify-center items-center" 
            style={{backgroundColor: '#001529'}}>
            <div className="w-4/5 sm:w-96 relative -top-32">
                <img className="m-6" src="/images/logo.svg" alt="logo" />
                <Form size="large" onFinish={onFinish}>
                    <Form.Item 
                        name="username" 
                        rules={[{ required: true, message: '请输入用户名！' }]}>
                        <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item 
                        name="password" 
                        rules={[{ required: true, message: '请输入密码！' }]}>
                        <Input prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" block htmlType="submit" loading={loading}>登录</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Login