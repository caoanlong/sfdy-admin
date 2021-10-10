import { 
    Form, 
    Button, 
    message, 
    Row,
    Col,
    InputNumber,
} from "antd"
import MoneyApi from "../../api/MoneyApi"
import { Money } from "../../types"

type NoticeAddProps = {
    handleOk: () => void, 
    handleCancel: () => void
}

function MoneyAdd({ handleOk, handleCancel }: NoticeAddProps) {
    const [ form ] = Form.useForm()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const data: Money = {
            price: values.price
        }
        MoneyApi.add(data).then(res => {
            message.success('添加成功！')
            handleOk()
        })
    }

    return (
        <Form
            name="moneyAdd"
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

export default MoneyAdd