import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
    Select,
} from "antd"
import React, { useEffect } from "react"
import SeoApi from "../../api/SeoApi"
import { Seo } from "../../types"
import { PLATFORM_MAP } from "../../utils/config"

type SeoEditProps = {
    seoId: number,
    handleOk: () => void, 
    handleCancel: () => void
}

function SeoEdit({ seoId, handleOk, handleCancel }: SeoEditProps) {
    const [ form ] = Form.useForm()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const data: Seo = {
            seoId,
            platform: values.platform,
            seoTitle: values.seoTitle,
            seoKeywords: values.seoKeywords,
            seoDescription: values.seoDescription
        }
        SeoApi.update(data).then(res => {
            message.success('修改成功！')
            handleOk()
        })
    }

    const getInfo = () => {
        SeoApi.findById({ seoId }).then(res => {
            const seo: Seo = res.data.data
            form.setFieldsValue({ platform: seo.platform })
            form.setFieldsValue({ seoTitle: seo.seoTitle })
            form.setFieldsValue({ seoKeywords: seo.seoKeywords })
            form.setFieldsValue({ seoDescription: seo.seoDescription })
        })
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <Form
            name="seoEdit"
            form={form}
            labelCol={{ span: 4 }}
            onFinish={onFinish}>
            <Form.Item 
                name="platform" 
                label="平台" 
                rules={[{ required: true, message: '平台不能为空!' }]}>
                <Select
                    placeholder="请选择"
                    allowClear >
                    {
                        Object.keys(PLATFORM_MAP).map((item: string) => (
                            <Select.Option key={item} value={+item}>{PLATFORM_MAP[+item]}</Select.Option>
                        ))
                    }
                </Select>
            </Form.Item>
            <Form.Item 
                name="seoTitle" 
                label="标题" 
                rules={[{ required: true, message: '标题不能为空!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="seoKeywords" 
                label="关键词" 
                rules={[{ required: true, message: '关键词不能为空!' }]}>
                <Input.TextArea placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="seoDescription" 
                label="描述" 
                rules={[{ required: true, message: '描述不能为空!' }]}>
                <Input.TextArea placeholder="请输入..."/>
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

export default SeoEdit