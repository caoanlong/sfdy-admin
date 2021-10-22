import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
    InputNumber,
    Select,
    Switch
} from "antd"
import React, { useEffect, useState } from "react"
import { City, Province } from "../../types"
import CityApi from "../../api/CityApi"
import ProvinceApi from "../../api/ProvinceApi"

type CityEditProps = {
    id: number,
    handleOk: () => void, 
    handleCancel: () => void
}

function CityEdit({ id, handleOk, handleCancel }: CityEditProps) {
    const [ form ] = Form.useForm()
    const [ provinces, setProvinces ] = useState<Province[]>()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const data: City = {
            id,
            pId: values.pId,
            name: values.name,
            ename: values.ename,
            sort: values.sort,
            isHot: values.isHot ? 1 : 0,
        }
        CityApi.update(data).then(res => {
            message.success('修改成功！')
            handleOk()
        })
    }

    const getProvices = () => {
        ProvinceApi.findAll().then(res => {
            setProvinces(res.data.data)
        })
    }
    const getInfo = () => {
        CityApi.findById({ id }).then(res => {
            const city: City = res.data.data
            form.setFieldsValue({ name: city.name })
            form.setFieldsValue({ ename: city.ename })
            form.setFieldsValue({ sort: city.sort })
            form.setFieldsValue({ pId: city.pId })
            form.setFieldsValue({ isHot: city.isHot ? true : false })
        })
    }

    useEffect(() => {
        getProvices()
        getInfo()
    }, [])

    return (
        <Form
            name="cityEdit"
            form={form}
            labelCol={{ span: 4 }}
            onFinish={onFinish}>
            <Form.Item 
                name="pId" 
                label="省份" 
                rules={[{ required: true, message: '省份不能为空!' }]}>
                <Select
                    placeholder="请选择"
                    allowClear >
                    {
                        provinces && provinces.length && 
                        provinces.map((item: Province) => (
                            <Select.Option key={item.id} value={item.id || ''}>{item.name}</Select.Option>
                        ))
                    }
                </Select>
            </Form.Item>
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
            <Form.Item 
                name="isHot" 
                label="是否热门" 
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

export default CityEdit