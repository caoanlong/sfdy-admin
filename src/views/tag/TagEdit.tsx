import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
} from "antd"
import { useEffect } from "react"
import TagApi from "../../api/TagApi"
import { TagItem } from "../../types"

type TagEditProps = {
    id: number,
    handleOk: () => void, 
    handleCancel: () => void
}

function TagEdit({ id, handleOk, handleCancel }: TagEditProps) {
    const [ form ] = Form.useForm()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = ({ name }: any) => {
        TagApi.update({ id, name }).then(res => {
            message.success('修改成功！')
            handleOk()
        })
    }

    const getInfo = () => {
        TagApi.findById({ id }).then(res => {
            const tag: TagItem = res.data.data
            form.setFieldsValue({ name: tag.name })
        })
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <Form
            name="tagEdit"
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

export default TagEdit