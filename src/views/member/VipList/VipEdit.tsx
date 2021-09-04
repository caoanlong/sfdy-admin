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
import { Vip } from "../../../types"

type VipEditProps = {
    vipId?: number,
    handleOk: Function, 
    handleCancel: Function
}

function VipEdit({ vipId, handleOk, handleCancel }: VipEditProps) {
    const [ form ] = Form.useForm()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = ({ validDays, price }: any) => {
        const data: Vip = {
            vipId,
            validDays,
            price
        }
        VipApi.update(data).then(res => {
            message.success('修改成功！')
            handleOk()
        })
    }


    const getInfo = () => {
        VipApi.findById({ vipId }).then(res => {
            const vip: Vip = res.data.data
            form.setFieldsValue({ validDays: vip.validDays })
            form.setFieldsValue({ price: vip.price })
        })
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <Form
            name="vipEdit"
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

export default VipEdit