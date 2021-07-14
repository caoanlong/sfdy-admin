import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
    Select,
    InputNumber
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import React, { ChangeEvent, useEffect, useState } from "react"
import { BANNER_TYPES } from "./BannerList"
import BannerApi from "../../api/BannerApi"
import { Banner } from "../../types"
import { formDataReq } from "../../utils/tools"

type BannerAddProps = {
    handleOk: Function, 
    handleCancel: Function
}

function BannerAdd({ handleOk, handleCancel }: BannerAddProps) {
    const [ form ] = Form.useForm()
    const [ types, setTypes ] = useState<{key: string, value: string}[]>([])
    const [ imageUrl, setImageUrl ] = useState<string>('')
    const [ bannerFile, setBannerFile ] = useState<File>()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const data: Banner = {
            bannerType: values.bannerType,
            bannerName: values.bannerName,
            bannerSort: values.bannerSort,
            bannerFile
        }
        if (values.bannerLink) {
            data.bannerLink = values.bannerLink
        }
        const formData = formDataReq(data)
        BannerApi.add(formData).then(res => {
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
            setBannerFile(file)
            form.setFieldsValue({'bannerUrl': file})
        }
    }

    useEffect(() => {
        const list = Object.keys(BANNER_TYPES).map((key: string) => ({ key, value: BANNER_TYPES[key]}))
        setTypes(list)
        form.setFieldsValue({ bannerType: '1' })
        form.setFieldsValue({ bannerSort: 1 })
    }, [])

    return (
        <Form
            name="bannerAdd"
            form={form}
            labelCol={{ span: 4 }}
            onFinish={onFinish}>
            <Form.Item 
                name="bannerType" 
                label="类型" 
                rules={[{ required: true, message: '类型不能为空!' }]}>
                <Select
                    placeholder="请选择"
                    allowClear>
                    {
                        types.map((type: {key: string, value: string}) => (
                            <Select.Option 
                                key={type.key} 
                                value={type.key}>
                                { type.value }
                            </Select.Option>
                        ))
                    }
                </Select>
            </Form.Item>
            <Form.Item 
                name="bannerName" 
                label="名称" 
                rules={[{ required: true, message: '名称不能为空!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item name="bannerSort" label="排序">
                <InputNumber min={1} max={100} />
            </Form.Item>
            <Form.Item 
                name="bannerUrl" 
                label="图片" 
                rules={[{ required: true, message: 'banner图片不能为空!' }]}>
                <div 
                    className="w-96 h-36 bg-gray-100 border-gray-300 border-dashed relative rounded-sm flex justify-center items-center text-2xl text-gray-400" 
                    style={{borderWidth: '1px'}}>
                    <input className="w-full h-full block opacity-0 absolute z-20" type="file" onChange={handleImgChange}/>
                    {
                        imageUrl
                        ? <img className="w-full h-full block absolute z-10 object-cover" src={imageUrl} alt="img"/>
                        : <></>
                    }
                    <PlusOutlined />
                </div>
            </Form.Item>
            <Form.Item name="bannerLink" label="跳转链接">
                <Input placeholder="https://..."/>
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

export default BannerAdd