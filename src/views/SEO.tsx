import {  
    Form, 
    Row, 
    Col, 
    Button, 
    Input, 
    message 
} from "antd"
import { useEffect, useState } from "react"
import SeoApi from "../api/SeoApi"
import { Seo } from "../types"

function SEO() {
    const [ form ] = Form.useForm()
    const [ seoId, setSeoId ] = useState<number>()

    const getInfo = () => {
        SeoApi.findSeo().then(res => {
            const data: Seo = res.data.data
            setSeoId(data.seoId)
            form.setFieldsValue({ 'seoTitle': data.seoTitle })
            form.setFieldsValue({ 'seoKeywords': data.seoKeywords })
            form.setFieldsValue({ 'seoDescription': data.seoDescription })
        })
    }

    const onFinish = ({ seoTitle, seoKeywords, seoDescription }: any) => {
        const data: Seo = {
            seoId, seoTitle, seoKeywords, seoDescription
        }
        SeoApi.update(data).then(res => {
            message.success('保存成功!')
        })
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <>
            <Form
                name="advanced_search"
                labelCol={{ span: 3 }}
                className="bg-white m-4 p-10 shadow"
                form={form}
                onFinish={onFinish}>
                <Form.Item name="seoTitle" label="Title" rules={[{ required: true, message: '标题不能为空!' }]}>
                    <Input placeholder="请输入..."/>
                </Form.Item>
                <Form.Item name="seoKeywords" label="Keywords" rules={[{ required: true, message: '关键词不能为空!' }]}>
                    <Input.TextArea rows={6} placeholder="请输入..."/>
                </Form.Item>
                <Form.Item name="seoDescription" label="Description" rules={[{ required: true, message: '描述不能为空!' }]}>
                    <Input.TextArea rows={8} placeholder="请输入..."/>
                </Form.Item>
                <Row>
                    <Col span={24} className="text-center">
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default SEO