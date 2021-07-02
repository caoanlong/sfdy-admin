import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
    InputNumber
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import React, { ChangeEvent, useEffect, useState } from "react"
import { Link } from "../../types"
import LinkApi from "../../api/LinkApi"
import { formDataReq } from "../../utils/tools"

type LinkAddProps = {
    handleOk: Function, 
    handleCancel: Function
}

function LinkAdd({ handleOk, handleCancel }: LinkAddProps) {
    const [ form ] = Form.useForm()
    const [ imageUrl, setImageUrl ] = useState<string>('')
    const [ linkFile, setLinkFile ] = useState<File>()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const data: Link = {
            linkName: values.linkName,
            linkSort: values.linkSort,
            linkUrl: values.linkUrl,
            linkType: 0
        }
        if (values.linkLogo) {
            data.linkFile = linkFile
        }
        const formData = formDataReq(data)
        LinkApi.add(formData).then(res => {
            message.success('添加成功！')
            handleOk()
        })
    }

    const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target && e.target.files) {
            const file = e.target.files[0]
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
            setLinkFile(file)
            form.setFieldsValue({'linkLogo': file})
        }
    }

    useEffect(() => {
        form.setFieldsValue({ linkSort: 1 })
    }, [])

    return (
        <Form
            name="linkAdd"
            form={form}
            labelCol={{ span: 4 }}
            onFinish={onFinish}>
            <Form.Item 
                name="linkName" 
                label="名称" 
                rules={[{ required: true, message: '名称不能为空!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="linkUrl" 
                label="跳转链接" 
                rules={[{ required: true, message: '名称不能为空!' }]}>
                <Input placeholder="https://..."/>
            </Form.Item>
            <Form.Item name="linkSort" label="排序">
                <InputNumber min={1} max={100} />
            </Form.Item>
            <Form.Item 
                name="linkLogo" 
                label="友链LOGO">
                <div 
                    className="w-96 h-36 bg-gray-100 border-gray-300 border-dashed relative rounded-sm flex justify-center items-center text-2xl text-gray-400" 
                    style={{borderWidth: '1px'}}>
                    <input className="w-full h-full block opacity-0 absolute z-20" type="file" onChange={handleImgChange}/>
                    {
                        imageUrl
                        ? <img className="w-full h-full block absolute z-10 object-cover" src={imageUrl} />
                        : <></>
                    }
                    <PlusOutlined />
                </div>
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

export default LinkAdd