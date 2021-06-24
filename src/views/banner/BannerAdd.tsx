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
import React, { useEffect, useState } from "react"
import { BANNER_TYPES } from "./BannerList"

export interface RefObj {
    msg: () => void
}


function BannerAdd({ handleOk, handleCancel }: { handleOk: Function, handleCancel: Function}) {
    const [ form ] = Form.useForm()
    const [ types, setTypes ] = useState<{key: string, value: string}[]>([])

    const onTypeChange = () => {

    }

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = () => {
        console.log('111111')
        handleOk()
    }

    useEffect(() => {
        const list = Object.keys(BANNER_TYPES).map((key: string) => ({ key, value: BANNER_TYPES[key]}))
        setTypes(list)
    }, [])

    return (
        <Form
            name="bannerAdd"
            form={form}
            labelCol={{ span: 4 }}
            onFinish={onFinish}>
            <Form.Item name="bannerType" label="类型">
                <Select
                    placeholder="请选择"
                    allowClear 
                    onChange={onTypeChange}>
                    {
                        types.map((type: {key: string, value: string}) => (
                            <Select.Option 
                                key={type.key} 
                                value={type.value}>
                                { type.value }
                            </Select.Option>
                        ))
                    }
                </Select>
            </Form.Item>
            <Form.Item name="bannerName" label="名称">
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item name="bannerSort" label="排序">
                <InputNumber min={1} max={100} defaultValue={1} />
            </Form.Item>
            <Form.Item name="bannerUrl" label="URL">
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item name="bannerLink" label="跳转链接">
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

export default BannerAdd