import React from "react"
import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
    Select,
    Switch,
    InputNumber
} from "antd"
import { AppVersion } from "../../types"
import AppVersionApi from "../../api/AppVersionApi"
import { PLATFORM_MAP } from "../../utils/config"

type AppVersionAddProps = {
    handleOk: Function, 
    handleCancel: Function
}

function AppVersionAdd({ handleOk, handleCancel }: AppVersionAddProps) {
    const [ form ] = Form.useForm()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const data: AppVersion = {
            platform: values.platform,
            newVersion: values.newVersion,
            newVersionCode: values.newVersionCode,
            minVersion: values.minVersion,
            minVersionCode: values.minVersionCode,
            appUrl: values.appUrl,
            description: values.description,
            isUpdate: values.isUpdate ? 1 : 0,
            device: values.device,
            size: values.size
        }
        AppVersionApi.add(data).then(res => {
            message.success('添加成功！')
            handleOk()
        })
    }

    return (
        <Form
            name="appVersionAdd"
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
                            <Select.Option value={+item}>{PLATFORM_MAP[+item]}</Select.Option>
                        ))
                    }
                </Select>
            </Form.Item>
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
                name="newVersionCode" 
                label="最新Code" 
                rules={[{ required: true, message: '最新版本Code不能为空!' }]}>
                <InputNumber min={1} max={10000} />
            </Form.Item>
            <Form.Item 
                name="minVersion" 
                label="最小版本" 
                rules={[{ required: true, message: '最小支持版本不能为空!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="minVersionCode" 
                label="最小版本Code" 
                rules={[{ required: true, message: '最小版本Code不能为空!' }]}>
                <InputNumber min={1} max={10000} />
            </Form.Item>
            <Form.Item 
                name="size" 
                label="大小(KB)" 
                rules={[{ required: true, message: '大小不能为空!' }]}>
                <InputNumber min={1} />
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