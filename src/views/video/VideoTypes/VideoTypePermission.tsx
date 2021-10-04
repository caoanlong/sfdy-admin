import { 
    Form, 
    Button,
    message, 
    Row,
    Col,
    InputNumber,
    Select
} from "antd"
import React, { useEffect, useState } from "react"
import { VodType } from "../../../types"
import VodTypeApi from "../../../api/VodTypeApi"
import { decodeUnicode } from "../../../utils/tools"
import VodApi from "../../../api/VodApi"

type VideoTypeEditProps = {
    typeId: number,
    handleOk: Function, 
    handleCancel: Function
}

function VideoTypePermission({ typeId, handleOk, handleCancel }: VideoTypeEditProps) {
    const [ form ] = Form.useForm()
    const [ type, setType ] = useState<VodType>()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const data: any = {
            typeId,
            vodClass: values.vodClass,
            permission: values.permission
        }
        VodApi.updatePermissionByClass(data).then(res => {
            message.success('修改成功！')
            handleOk()
        })
    }

    const getInfo = () => {
        VodTypeApi.findById({ typeId }).then(res => {
            const vodType: VodType = res.data.data
            
            form.setFieldsValue({ vodClass: '' })
            if (vodType.typeExtend) {
                const typeExtendJson = JSON.parse(decodeUnicode((vodType.typeExtend)))
                const classes = typeExtendJson?.class
                if (classes) {
                    const classList = classes?.split(',')
                    vodType.classList = classList
                }
            }
            setType(vodType)
        })
    }

    const onChange = (value: number) => {
        form.setFieldsValue({ vodClass: value })
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <>
        <h1 className="text-center text-2xl mb-4">{type?.typeName}</h1>
        <Form
            name="permissionEdit"
            form={form}
            labelCol={{ span: 4 }}
            onFinish={onFinish}>
            <Form.Item 
                name="vodClass" 
                label="名称">
                <Select
                    placeholder="请选择"
                    allowClear 
                    onChange={onChange}>
                    <Select.Option value="">全部</Select.Option>
                    {
                        type && type.classList ? type.classList.map((item: string) => (
                            <Select.Option key={item} value={item}>{item}</Select.Option>
                        )) : <></>
                    }
                </Select>
            </Form.Item>
            <Form.Item 
                name="permission" 
                label="权限">
                <InputNumber min={0} max={10} step="1"/>
            </Form.Item>
            <Row>
                <Col span={24} className="text-right">
                    <Button className="mr-3" onClick={onCancel}>取消</Button>
                    <Button type="primary" htmlType="submit">确定</Button>
                </Col>
            </Row>
        </Form>
        </>
    )
}

export default VideoTypePermission