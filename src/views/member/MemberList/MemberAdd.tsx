import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
    Select
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import React, { ChangeEvent, useState } from "react"
import { formDataReq } from "../../../utils/tools"
import { Member } from "../../../types"
import MemberApi from "../../../api/MemberApi"

type MemberAddProps = {
    handleOk: Function, 
    handleCancel: Function
}

function MemberAdd({ handleOk, handleCancel }: MemberAddProps) {
    const [ form ] = Form.useForm()
    const [ imageUrl, setImageUrl ] = useState<string>('')
    const [ avatarFile, setAvatarFile ] = useState<File>()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const data: Member = {
            platform: values.platform,
            memberName: values.memberName,
            mobile: values.mobile,
            email: values.email,
            password: values.password,
            isAgent: 1,
            status: 1,
            avatarFile
        }
        const formData = formDataReq(data)
        MemberApi.add(formData).then(res => {
            message.success('添加成功！')
            handleOk()
        })
    }

    const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target && e.target.files) {
            const file: File = e.target.files[0]
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
            if (!isJpgOrPng) {
                message.error('只支持JPG/PNG文件')
                return
            }
            const isLt5M = file.size / 1024 / 1024 < 5
            if (!isLt5M) {
                message.error('图片必须小于5MB!')
                return
            }
            setImageUrl(window.URL.createObjectURL(file))
            setAvatarFile(file)
            form.setFieldsValue({avatar: file})
        }
    }

    return (
        <Form
            name="memberEdit"
            form={form}
            labelCol={{ span: 4 }}
            onFinish={onFinish}>
            <Form.Item 
                name="avatar" 
                label="头像">
                <div 
                    className="w-36 h-36 bg-gray-100 border-gray-300 border-dashed relative rounded-sm flex justify-center items-center text-2xl text-gray-400" 
                    style={{borderWidth: '1px'}}>
                    <input className="w-full h-full block opacity-0 absolute z-20" type="file" onChange={handleImgChange}/>
                    {
                        imageUrl
                        ? <img className="w-full h-full block absolute z-10 object-cover" src={imageUrl} alt="img" />
                        : <></>
                    }
                    <PlusOutlined />
                </div>
            </Form.Item>
            <Form.Item 
                name="platform" 
                label="平台"
                rules={[{ required: true, message: '平台不能为空!' }]}>
                <Select
                    placeholder="请选择"
                    allowClear>
                    <Select.Option value={1}>巨硬AV</Select.Option>
                    <Select.Option value={2}>凤楼</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item 
                name="isAgent" 
                label="代理">
                <span>是</span>
            </Form.Item>
            <Form.Item 
                name="memberName" 
                label="名称" 
                rules={[{ pattern: /^[a-zA-Z]\w{4,14}$/,  message: '名称格式错误!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="mobile" 
                label="手机号" 
                rules={[{ pattern: /^[1][3-9][0-9]{9}$/, message: '手机格式错误!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="email" 
                label="邮箱" 
                rules={[{ pattern: /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/, message: '邮箱格式错误!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="password" 
                label="密码" 
                rules={[{ required: true, message: '密码不能为空!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Row>
                <Col span={24} className="text-right">
                    <Button className="mr-3" onClick={onCancel}>取消</Button>
                    <Button type="primary" htmlType="submit">确定</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default MemberAdd