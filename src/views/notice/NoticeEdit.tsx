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
import NoticeApi from "../../api/NoticeApi"
import { Notice } from "../../types"
import { PLATFORM_MAP } from "../../utils/config"

type NoticeEditProps = {
    id: number,
    handleOk: () => void, 
    handleCancel: () => void
}

function NoticeEdit({ id, handleOk, handleCancel }: NoticeEditProps) {
    const [ form ] = Form.useForm()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const data: Notice = {
            id,
            platform: values.platform,
            title: values.title,
            content: values.content
        }
        NoticeApi.update(data).then(res => {
            message.success('修改成功！')
            handleOk()
        })
    }

    const getInfo = () => {
        NoticeApi.findById({ id }).then(res => {
            const notice: Notice = res.data.data
            form.setFieldsValue({ platform: notice.platform })
            form.setFieldsValue({ title: notice.title })
            form.setFieldsValue({ content: notice.content })
        })
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <Form
            name="noticeEdit"
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
                name="title" 
                label="标题" 
                rules={[{ required: true, message: '标题不能为空!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="content" 
                label="内容">
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

export default NoticeEdit