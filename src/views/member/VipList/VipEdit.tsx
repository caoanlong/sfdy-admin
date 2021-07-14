import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
    InputNumber
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import React, { ChangeEvent, useEffect, useState } from "react"
import { formDataReq } from "../../../utils/tools"
import VipApi from "../../../api/VipApi"
import { Vip } from "../../../types"
import { SITE_NAME } from "../../../utils/consts"

type VipEditProps = {
    vipId?: number,
    handleOk: Function, 
    handleCancel: Function
}

function VipEdit({ vipId, handleOk, handleCancel }: VipEditProps) {
    const [ form ] = Form.useForm()
    const [ imageUrl, setImageUrl ] = useState<string>('')
    const [ vipIconFile, setVipIconFile ] = useState<File>()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const data: Vip = {
            vipId,
            vipName: values.vipName,
            level: values.level,
            validDays: values.validDays,
            vipIconFile
        }
        const formData = formDataReq(data)
        VipApi.update(formData).then(res => {
            message.success('修改成功！')
            handleOk()
        })
    }

    const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target && e.target.files) {
            const file: File = e.target.files[0]
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
            if (!isJpgOrPng) {
                message.error('只支持JPG/PNG文件')
                return
            }
            const isLt5M = file.size / 1024 / 1024 < 5
            if (!isLt5M) {
                message.error('图片必须小于5MB!')
                return
            }
            setImageUrl(window.URL.createObjectURL(file))
            setVipIconFile(file)
            form.setFieldsValue({vipIcon: file})
        }
    }

    const getInfo = () => {
        VipApi.findById({ vipId }).then(res => {
            const vip: Vip = res.data.data
            form.setFieldsValue({ vipName: vip.vipName })
            form.setFieldsValue({ level: vip.level })
            form.setFieldsValue({ validDays: vip.validDays })
            if (vip.vipIcon) {
                setImageUrl(SITE_NAME + vip.vipIcon)
                form.setFieldsValue({ vipIcon: vip.vipIcon })
            }
        })
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <Form
            name="vipAdd"
            form={form}
            labelCol={{ span: 4 }}
            onFinish={onFinish}>
            <Form.Item 
                name="vipName" 
                label="名称" 
                rules={[{ required: true, message: '名称不能为空!' }]}>
                <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item 
                name="vipIcon" 
                label="图标">
                <div 
                    className="w-36 h-36 bg-gray-100 border-gray-300 border-dashed relative rounded-sm flex justify-center items-center text-2xl text-gray-400" 
                    style={{borderWidth: '1px'}}>
                    <input className="w-full h-full block opacity-0 absolute z-20" type="file" onChange={handleImgChange}/>
                    {
                        imageUrl
                        ? <img className="w-full h-full block absolute z-10 object-cover" src={imageUrl} alt="img" />
                        : <></>
                    }
                    <PlusOutlined />
                </div>
            </Form.Item>
            <Form.Item name="level" label="等级" rules={[{ required: true, message: '等级不能为空!' }]}>
                <InputNumber min={1} max={100} />
            </Form.Item>
            <Form.Item name="validDays" label="有效天数" rules={[{ required: true, message: '有效天数不能为空!' }]}>
                <InputNumber min={1} max={99999} />
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