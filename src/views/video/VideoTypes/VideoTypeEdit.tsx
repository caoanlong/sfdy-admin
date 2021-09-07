import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
    Switch,
    Tag,
    InputNumber
} from "antd"
import React, { useEffect, useState } from "react"
import { VodType } from "../../../types"
import VodTypeApi from "../../../api/VodTypeApi"
import { decodeUnicode } from "../../../utils/tools"

type VideoTypeEditProps = {
    typeId: number,
    handleOk: Function, 
    handleCancel: Function
}

function VideoTypeEdit({ typeId, handleOk, handleCancel }: VideoTypeEditProps) {
    const [ form ] = Form.useForm()
    const [ type, setType ] = useState<VodType>()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const data: VodType = {
            typeId,
            typeName: values.typeName,
            typeEn: values.typeEn,
            typeKey: values.typeKey,
            typeDes: values.typeDes,
            typeSort: values.typeSort,
            typeStatus: values.typeStatus ? 1 : 0
        }
        VodTypeApi.update(data).then(res => {
            message.success('修改成功！')
            handleOk()
        })
    }

    const getInfo = () => {
        VodTypeApi.findById({ typeId }).then(res => {
            const vodType: VodType = res.data.data
            
            form.setFieldsValue({ typeName: vodType.typeName })
            form.setFieldsValue({ typeEn: vodType.typeEn })
            form.setFieldsValue({ typeStatus: vodType.typeStatus })
            form.setFieldsValue({ typeKey: vodType.typeKey })
            form.setFieldsValue({ typeDes: vodType.typeDes })
            form.setFieldsValue({ typeSort: vodType.typeSort })
            if (vodType.typeExtend) {
                const typeExtendJson = JSON.parse(decodeUnicode((vodType.typeExtend)))
                const classes = typeExtendJson?.class
                const classList = classes?.split(',')
                vodType.classList = classList
            }
            setType(vodType)
        })
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <Form
            name="vodTypeEdit"
            form={form}
            labelCol={{ span: 4 }}
            onFinish={onFinish}>
            <Form.Item 
                name="typeName" 
                label="名称" 
                rules={[{ required: true, message: '名称不能为空!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="typeEn" 
                label="英文名" 
                rules={[{ required: true, message: '英文名不能为空!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Row>
                <Col span={12}>
                    <Form.Item 
                        labelCol={{ span: 8 }}
                        name="typeStatus" 
                        label="状态" 
                        valuePropName="checked">
                        <Switch 
                            checkedChildren="正常" 
                            unCheckedChildren="禁用"  
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item 
                        labelCol={{ span: 8 }}
                        name="typeSort" 
                        label="排序">
                        <InputNumber min={0} max={10000} step="1"/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item 
                name="typeKey" 
                label="关键词">
                <Input.TextArea placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="typeDes" 
                label="描述">
                <Input.TextArea placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="classList" 
                label="子分类">
                <div>
                    {
                        type && type.classList ?
                            type.classList.map((item: string) => (
                                <Tag key={item} className="mb-1">{item}</Tag>
                            )) : <></>
                        
                    }
                </div>
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

export default VideoTypeEdit