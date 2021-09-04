import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
    Switch,
    Tag
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import React, { ChangeEvent, useEffect, useState } from "react"
import { formDataReq } from "../../../utils/tools"
import { Member, Vip } from "../../../types"
import { SITE_NAME } from "../../../utils/consts"
import MemberApi from "../../../api/MemberApi"

type MemberEditProps = {
    memberId?: number,
    handleOk: Function, 
    handleCancel: Function
}

function MemberEdit({ memberId, handleOk, handleCancel }: MemberEditProps) {
    const [ form ] = Form.useForm()
    const [ imageUrl, setImageUrl ] = useState<string>('')
    const [ avatarFile, setAvatarFile ] = useState<File>()
    const [ member, setMember ] = useState<Member>()
    const [ selectedVips, setSelectedVips ] = useState<Vip[]>([])

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const vipIds = selectedVips.map((item: Vip) => item.vipId)
        const data: Member = {
            memberId,
            memberName: values.memberName,
            mobile: values.mobile,
            email: values.email,
            password: values.password,
            status: values.status ? 1 : 0,
            avatarFile
        }
        if (vipIds && vipIds.length > 0) {
            data.vipIds = vipIds as number[]
        }
        const formData = formDataReq(data)
        MemberApi.update(formData).then(res => {
            message.success('修改成功！')
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

    const getInfo = () => {
        MemberApi.findById({ memberId }).then(res => {
            const mem: Member = res.data.data
            form.setFieldsValue({ memberName: mem.memberName })
            form.setFieldsValue({ mobile: mem.mobile })
            form.setFieldsValue({ email: mem.email })
            form.setFieldsValue({ status: mem.status ? true : false })
            form.setFieldsValue({ isAgent: mem.isAgent })
            if (mem.avatar) {
                setImageUrl(SITE_NAME + mem.avatar)
                form.setFieldsValue({ avatar: mem.avatar })
            }
            setMember(mem)
            setSelectedVips(mem.vips as Vip[])
        })
    }

    useEffect(() => {
        getInfo()
    }, [])

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
            <Row>
                <Col span={12}>
                    <Form.Item 
                        name="isAgent" 
                        label="代理" 
                        labelCol={{span: 8}}>
                        <span>{member?.isAgent === 0 ? '否' : '是'}</span>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item 
                        name="status" 
                        label="状态" 
                        labelCol={{span: 8}}
                        valuePropName="checked">
                        <Switch 
                            checkedChildren="正常" 
                            unCheckedChildren="禁用"  
                        />
                    </Form.Item>
                </Col>
            </Row>
            
            <Form.Item 
                name="randomCode" 
                label="推广链接">
                <a 
                    target="_blank"
                    href={'https://jyavs.com/register/' + member?.randomCode}
                    className="text-blue-500">
                    {'https://jyavs.com/register/' + member?.randomCode}
                </a>
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
                label="密码">
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Row className="pb-2">
                <Col span={4} className="text-right">
                    VIP时长：
                </Col>
                <Col span={20}>
                    {
                        selectedVips.map((vip: Vip, i: number) => {
                            return <Tag 
                                className="mb-2"
                                key={i + '' + (vip.vipId || 0)}>
                                {vip.validDays}天
                            </Tag>
                        })
                    }
                </Col>
            </Row>
            <Row>
                <Col span={24} className="text-right">
                    <Button className="mr-3" onClick={onCancel}>取消</Button>
                    <Button type="primary" htmlType="submit">确定</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default MemberEdit