import { 
    Form, 
    Button, 
    message, 
    Row,
    Col,
    InputNumber,
} from "antd"
import React, { useEffect } from "react"
import MoneyApi from "../../api/MoneyApi"
import { Money } from "../../types"

type MoneyEditProps = {
    id: number,
    handleOk: () => void, 
    handleCancel: () => void
}

function MoneyEdit({ id, handleOk, handleCancel }: MoneyEditProps) {
    const [ form ] = Form.useForm()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const data: Money = {
            id,
            price: values.price
        }
        MoneyApi.update(data).then(res => {
            message.success('修改成功！')
            handleOk()
        })
    }

    const getInfo = () => {
        MoneyApi.findById({ id }).then(res => {
            const money: Money = res.data.data
            form.setFieldsValue({ price: money.price })
        })
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <Form
            name="moneyEdit"
            form={form}
            labelCol={{ span: 4 }}
            onFinish={onFinish}>
            <Form.Item 
                name="price" 
                label="面额" 
                rules={[{ required: true, message: '面额不能为空!' }]}>
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

export default MoneyEdit