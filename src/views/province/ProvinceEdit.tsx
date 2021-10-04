import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
    InputNumber
} from "antd"
import React, { useEffect } from "react"
import { Province } from "../../types"
import ProvinceApi from "../../api/ProvinceApi"

type ProvinceEditProps = {
    id: number,
    handleOk: () => void, 
    handleCancel: () => void
}

function ProvinceEdit({ id, handleOk, handleCancel }: ProvinceEditProps) {
    const [ form ] = Form.useForm()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const data: Province = {
            id,
            name: values.name,
            ename: values.ename,
            sort: values.sort
        }
        ProvinceApi.update(data).then(res => {
            message.success('修改成功！')
            handleOk()
        })
    }

    const getInfo = () => {
        ProvinceApi.findById({ id }).then(res => {
            const province: Province = res.data.data
            form.setFieldsValue({ name: province.name })
            form.setFieldsValue({ ename: province.ename })
            form.setFieldsValue({ sort: province.sort })
        })
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <Form
            name="provinceEdit"
            form={form}
            labelCol={{ span: 4 }}
            onFinish={onFinish}>
            <Form.Item 
                name="name" 
                label="名称" 
                rules={[{ required: true, message: '名称不能为空!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="ename" 
                label="名称code" 
                rules={[{ required: true, message: '名称code不能为空!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item name="sort" label="排序">
                <InputNumber min={1} max={1000} />
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

export default ProvinceEdit