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

function ScriptCode() {
    const [ form ] = Form.useForm()
    const [ seoId, setSeoId ] = useState<number>()

    const getInfo = () => {
        SeoApi.findScript().then(res => {
            const data: Seo = res.data.data
            setSeoId(data.seoId)
            form.setFieldsValue({ 'seoScript': data.seoScript })
        })
    }

    const onFinish = ({ seoScript }: any) => {
        const data: Seo = {
            seoId, seoScript
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
                <Form.Item name="seoScript" label="脚本">
                    <Input.TextArea rows={18} placeholder="请输入..."/>
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

export default ScriptCode