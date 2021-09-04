import { 
    Form, 
    Button, 
    message, 
    Row,
    Col,
    InputNumber
} from "antd"
import React, { useEffect } from "react"
import VipApi from "../../../api/VipApi"

type VipAddProps = {
    handleOk: Function, 
    handleCancel: Function
}

function VipAdd({ handleOk, handleCancel }: VipAddProps) {
    const [ form ] = Form.useForm()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = ({ validDays, price }: any) => {
        VipApi.add({ validDays, price }).then(res => {
            message.success('添加成功！')
            handleOk()
        })
    }

    useEffect(() => {
        form.setFieldsValue({ validDays: 1 })
    }, [])

    return (
        <Form
            name="vipAdd"
            form={form}
            labelCol={{ span: 4 }}
            onFinish={onFinish}>
            <Form.Item name="validDays" label="有效天数" rules={[{ required: true, message: '有效天数不能为空!' }]}>
                <InputNumber min={1} max={99999} />
            </Form.Item>
            <Form.Item name="price" label="价格">
                <InputNumber min={0} />
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

export default VipAdd