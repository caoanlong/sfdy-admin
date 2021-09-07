import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
    Select,
    InputNumber,
    Tag
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import React, { ChangeEvent, useEffect, useState } from "react"
import { decodeUnicode, formDataReq } from "../../../utils/tools"
import { SITE_NAME } from "../../../utils/consts"
import { Res, TypeExtend, Vod, VodType } from "../../../types"
import VodApi from "../../../api/VodApi"
import VodTypeApi from "../../../api/VodTypeApi"

type VideoEditProps = {
    vodId?: number,
    handleOk: Function, 
    handleCancel: Function
}

function VideoEdit({ vodId, handleOk, handleCancel}: VideoEditProps) {
    const [ form ] = Form.useForm()
    const [ imageUrl, setImageUrl ] = useState<string>('')
    const [ types, setTypes ] = useState<VodType[]>()
    const [ vod, setVod ] = useState<Vod>()
    const [ typeExtend, setTypeExtend ] = useState<TypeExtend>()

    const onCancel = () => {
        handleCancel()
    }
    const onFinish = (values: any) => {
        const data: any = {
            vodId,
            typeId: values.typeId,
            vodClass: values.vodClass,
            vodName: values.vodName,
            vodEn: values.vodEn,
            vodScore: values.vodScore,
            vodPlayUrl: values.vodPlayUrl,
            permission: values.permission
        }
        const formData = formDataReq(data)
        VodApi.update(formData).then(res => {
            message.success('修改成功！')
            handleOk()
        })
    }

    const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target && e.target.files) {
            const file = e.target.files[0]
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
            // setVodFile(file)
            form.setFieldsValue({vodPic: file})
        }
    }

    useEffect(() => {
        Promise.all([VodTypeApi.findAll(), VodApi.findById({ vodId })]).then(res => {
            const res1: Res<VodType[]> = res[0].data, res2: Res<Vod> = res[1].data
            setTypes(res1.data)
            setVod(res2.data)
            const curType = res1.data?.find(item => item.typeId === res2.data?.typeId)
            setTypeExtend(JSON.parse(decodeUnicode(curType?.typeExtend as string)))
            form.setFieldsValue({typeId: res2.data?.typeId})
            form.setFieldsValue({vodName: res2.data?.vodName})
            form.setFieldsValue({vodEn: res2.data?.vodEn})
            form.setFieldsValue({vodClass: res2.data?.vodClass})
            form.setFieldsValue({vodScore: res2.data?.vodScore})
            form.setFieldsValue({vodPlayUrl: res2.data?.vodPlayUrl})
            form.setFieldsValue({permission: res2.data?.permission})
            if (res2.data?.vodPic?.startsWith('http')) {
                form.setFieldsValue({vodPic: res2.data?.vodPic})
                setImageUrl(res2.data?.vodPic)
            } else {
                form.setFieldsValue({vodPic: SITE_NAME + '/' + res2.data?.vodPic})
                setImageUrl(SITE_NAME + '/' + res2.data?.vodPic)
            }
        })
    }, [])

    return (
        <>
            <Form
                name="videoEdit"
                form={form}
                labelCol={{ span: 4 }}
                onFinish={onFinish}>
                <Row>
                    <Col span={12}>
                        <Form.Item 
                            labelCol={{ span: 8 }}
                            name="typeId" 
                            label="类型" 
                            rules={[{ required: true, message: '类型不能为空!' }]}>
                            <Select
                                placeholder="请选择"
                                allowClear>
                                {
                                    types ? types.map((type: VodType) => (
                                        <Select.Option 
                                            key={type.typeId} 
                                            value={type.typeId}>
                                            { type.typeName }
                                        </Select.Option>
                                    )) : <></>
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item 
                            labelCol={{ span: 8 }}
                            name="vodClass" 
                            label="扩展分类" 
                            rules={[{ required: true, message: '扩展分类不能为空!' }]}>
                            <Select
                                placeholder="请选择"
                                allowClear>
                                {
                                    typeExtend ? typeExtend.class.split(',').map((cls: string) => (
                                        <Select.Option 
                                            key={cls} 
                                            value={cls}>
                                            { cls }
                                        </Select.Option>
                                    )) : <></>
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item 
                    name="vodName" 
                    label="标题" 
                    rules={[{ required: true, message: '标题不能为空!' }]}>
                    <Input placeholder="请输入..."/>
                </Form.Item>
                <Form.Item 
                    name="vodEn" 
                    label="别名">
                    <Input placeholder="请输入..."/>
                </Form.Item>
                <Row>
                    <Col span={12}>
                        <Form.Item 
                            labelCol={{ span: 8 }}
                            name="vodScore" 
                            label="评分" 
                            rules={[{ required: true, message: '评分不能为空!' }]}>
                            <InputNumber min={0.5} max={10} step="0.5"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item 
                            labelCol={{ span: 8 }}
                            name="vodPlayFrom" 
                            label="播放器">
                            <Tag color="magenta">{vod?.vodPlayFrom}</Tag>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item 
                            name="vodPic" 
                            label="图片" 
                            labelCol={{ span: 8 }}
                            rules={[{ required: true, message: '图片不能为空!' }]}>
                            <div 
                                className="w-52 h-36 bg-gray-100 border-gray-300 border-dashed relative rounded-sm flex justify-center items-center text-2xl text-gray-400" 
                                style={{borderWidth: '1px'}}>
                                <input className="w-full h-full block opacity-0 absolute z-20" type="file" onChange={handleImgChange}/>
                                {
                                    imageUrl
                                    ? <img className="w-full h-full block absolute z-10 object-cover" src={imageUrl} alt="img"/>
                                    : <></>
                                }
                                <PlusOutlined />
                            </div>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item 
                            labelCol={{ span: 8 }}
                            name="permission" 
                            label="权限">
                            <InputNumber min={0} max={10} step="1"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item 
                    name="vodPlayUrl" 
                    label="播放地址" 
                    rules={[{ required: true, message: '播放地址不能为空!' }]}>
                    <Input placeholder="请输入..."/>
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

export default VideoEdit