import React, { useEffect } from "react"
import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
    Select,
    Switch
} from "antd"
import { AppVersion } from "../../types"
import AppVersionApi from "../../api/AppVersionApi"

type AppVersionAddProps = {
    id: number,
    handleOk: Function, 
    handleCancel: Function
}

function AppVersionAdd({ id, handleOk, handleCancel }: AppVersionAddProps) {
    const [ form ] = Form.useForm()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        console.log(values)
        const data: AppVersion = {
            id,
            newVersion: values.newVersion,
            minVersion: values.minVersion,
            appUrl: values.appUrl,
            description: values.description,
            isUpdate: values.isUpdate ? 1 : 0,
            device: values.device
        }
        AppVersionApi.update(data).then(res => {
            message.success('修改成功！')
            handleOk()
        })
    }

    const getInfo = () => {
        AppVersionApi.findById({ id }).then(res => {
            const link: AppVersion = res.data.data
            form.setFieldsValue({ device: link.device })
            form.setFieldsValue({ newVersion: link.newVersion })
            form.setFieldsValue({ minVersion: link.minVersion })
            form.setFieldsValue({ appUrl: link.appUrl })
            form.setFieldsValue({ description: link.description })
            form.setFieldsValue({ isUpdate: link.isUpdate ? true : false })
        })
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <Form
            name="appVersionEdit"
            form={form}
            labelCol={{ span: 4 }}
            onFinish={onFinish}>
            <Form.Item 
                name="device" 
                label="设备" 
                rules={[{ required: true, message: '设备不能为空!' }]}>
                <Select
                    placeholder="请选择"
                    allowClear >
                    <Select.Option value={1}>Android</Select.Option>
                    <Select.Option value={2}>iOS</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item 
                name="newVersion" 
                label="最新版本" 
                rules={[{ required: true, message: '最新版本不能为空!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="minVersion" 
                label="最小支持版本" 
                rules={[{ required: true, message: '最小支持版本不能为空!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="appUrl" 
                label="APP下载地址" 
                rules={[{ required: true, message: 'APP下载地址不能为空!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="description" 
                label="更新内容" 
                rules={[{ required: true, message: '更新内容不能为空!' }]}>
                <Input.TextArea placeholder="请输入..." rows={6}/>
            </Form.Item>
            <Form.Item 
                name="isUpdate" 
                label="是否更新" 
                valuePropName="checked">
                <Switch 
                    checkedChildren="是" 
                    unCheckedChildren="否"  
                />
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

export default AppVersionAdd