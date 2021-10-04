import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
} from "antd"
import TagApi from "../../api/TagApi"

type TagAddProps = {
    handleOk: () => void, 
    handleCancel: () => void
}

function TagAdd({ handleOk, handleCancel }: TagAddProps) {
    const [ form ] = Form.useForm()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = ({ name }: any) => {
        TagApi.add({ name }).then(res => {
            message.success('添加成功！')
            handleOk()
        })
    }

    return (
        <Form
            name="tagAdd"
            form={form}
            labelCol={{ span: 4 }}
            onFinish={onFinish}>
            <Form.Item 
                name="name" 
                label="名称" 
                rules={[{ required: true, message: '名称不能为空!' }]}>
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

export default TagAdd