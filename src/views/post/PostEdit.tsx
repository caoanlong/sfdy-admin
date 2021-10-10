import { 
    Form, 
    Button, 
    Input,
    message, 
    Row,
    Col,
    Select,
    InputNumber
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { City, Post, Province, TagItem } from "../../types"
import CityApi from "../../api/CityApi"
import ProvinceApi from "../../api/ProvinceApi"
import { useHistory, useLocation } from "react-router"
import TagApi from "../../api/TagApi"
import PostApi from "../../api/PostApi"
import { formDataReq } from "../../utils/tools"
import CommonApi from "../../api/CommonApi"


function PostEdit() {
    const history = useHistory()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const id: number = +(query.get('id') as string)
    const [ form ] = Form.useForm()
    const [ provinces, setProvinces ] = useState<Province[]>()
    const [ cities, setCities ] = useState<City[]>()
    const [ tags, setTags ] = useState<TagItem[]>()
    const [ imageUrl, setImageUrl ] = useState<string>('')
    const [ imageFile, setImageFile ] = useState<File>()
    const [ content, setContent ] = useState<string>('')

    const quill = useRef<any>()

    const onFinish = (values: any) => {
        const data: Post = {
            id,
            city: values.city,
            title: values.title,
            price: values.price,
            contactInfo: values.contactInfo,
            content,
            tags: values.tags,
            imageFile
        }
        const formData = formDataReq(data)
        PostApi.update(formData).then(res => {
            message.success('修改成功！')
            history.push('/fenglou/posts')
        })
    }

    const getProvices = () => {
        ProvinceApi.findAll().then(res => {
            setProvinces(res.data.data)
        })
    }

    const getCities = (pId: number) => {
        CityApi.findAll({ pId }).then(res => {
            setCities(res.data.data)
        })
    }

    const getTags = () => {
        TagApi.findAll().then(res => {
            setTags(res.data.data)
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
            setImageFile(file)
            form.setFieldsValue({'imageUrl': file})
        }
    }

    const getInfo = () => {
        PostApi.findById({ id }).then(res => {
            const post: Post = res.data.data
            form.setFieldsValue({ title: post.title })
            form.setFieldsValue({ contactInfo: post.contactInfo })
            form.setFieldsValue({ price: post.price })
            if (post.content) {
                setContent(post.content)
            }
            if (post.province) {
                form.setFieldsValue({ pId: post.province })
                getCities(post.province)
                form.setFieldsValue({ city: post.city })
            }
            if (post.tagList && post.tagList.length) {
                form.setFieldsValue({ tags: post.tagList.map((item: TagItem) => item.id)})
            }
            if (post.image) {
                setImageUrl(post.image)
                form.setFieldsValue({ imageUrl: post.image })
            }
        })
    }

    useEffect(() => {
        getProvices()
        getTags()
        getInfo()
    }, [])

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                [{ 'color': [] }, { 'background': [] }],
                ['bold', 'italic', 'underline','strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image'],
                ['clean'],
            ],
            handlers: {
                image: () => {
                    const quillEditor = quill.current.getEditor()
                    const input = document.createElement('input')
                    input.setAttribute('type', 'file')
                    input.setAttribute('accept', 'image/*')
                    input.addEventListener('change', () => {
                        const file = input.files?.[0]
                        const data = { file }
                        const formData = formDataReq(data)
                        CommonApi.upload('fenglou', formData).then(res => {
                            console.log(res.data)
                            const range = quillEditor.getSelection()
                            quillEditor.insertEmbed(range.index, 'image', res.data.data);
                        })
                    })
                    input.click()
                }
            }
        }
    }

    return (
        <Form
            className="bg-white p-4 shadow m-4"
            name="postEdit"
            form={form}
            onFinish={onFinish}>
            <Row>
                <Col span={6} >
                    <Form.Item 
                        name="imageUrl" 
                        label="图片" 
                        rules={[{ required: true, message: '图片不能为空!' }]}>
                        <div 
                            className="w-40 h-40 bg-gray-100 border border-gray-300 border-dashed relative rounded-sm flex justify-center items-center text-2xl text-gray-400">
                            <input 
                                className="w-full h-full block opacity-0 absolute z-20" 
                                type="file" 
                                onChange={handleImgChange}
                            />
                            {
                                imageUrl
                                ? <img 
                                    className="w-full h-full block absolute z-10 object-cover" 
                                    src={imageUrl} 
                                    alt="img"
                                /> : <></>
                            }
                            <PlusOutlined />
                        </div>
                    </Form.Item>
                </Col>
                <Col span={9}>
                    <Form.Item 
                        labelCol={{ span: 8 }}
                        name="title" 
                        label="标题" 
                        rules={[{ required: true, message: '标题不能为空!' }]}>
                        <Input placeholder="请输入..."/>
                    </Form.Item>
                    <Form.Item 
                        labelCol={{ span: 8 }}
                        name="tags" 
                        label="标签">
                        <Select
                            placeholder="请选择"
                            allowClear 
                            mode="multiple">
                            {
                                tags && tags.length && 
                                tags.map((item: TagItem) => (
                                    <Select.Option key={item.id} value={item.id || ''}>{item.name}</Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item 
                        labelCol={{ span: 8 }}
                        name="contactInfo" 
                        label="联系方式">
                        <Input.TextArea placeholder="请输入..."/>
                    </Form.Item>
                </Col>
                <Col span={9}>
                    <Form.Item 
                        labelCol={{ span: 8 }}
                        name="pId" 
                        label="省份" 
                        rules={[{ required: true, message: '省份不能为空!' }]}>
                        <Select
                            placeholder="请选择"
                            allowClear 
                            onChange={(value: number) => {
                                form.setFieldsValue({ city: null })
                                getCities(value)
                            }}>
                            {
                                provinces && provinces.length && 
                                provinces.map((item: Province) => (
                                    <Select.Option key={item.id} value={item.id || ''}>{item.name}</Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item 
                        labelCol={{ span: 8 }}
                        name="city" 
                        label="城市" 
                        rules={[{ required: true, message: '城市不能为空!' }]}>
                        <Select
                            placeholder="请选择"
                            allowClear >
                            {
                                cities && cities.length && 
                                cities.map((item: City) => (
                                    <Select.Option key={item.id} value={item.id || ''}>{item.name}</Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item 
                        labelCol={{ span: 8 }} 
                        name="price" 
                        label="价格">
                        <InputNumber className="w-full" min={0} max={10000} />
                    </Form.Item>
                </Col>
            </Row>
            
            <Form.Item 
                labelCol={{ span: 1 }}
                className="mb-16"
                label="内容" 
                rules={[{ required: true, message: '内容不能为空!' }]}>
                <ReactQuill 
                    ref={quill}
                    style={{ height: 500 }}
                    theme="snow" 
                    modules={modules}
                    value={content} 
                    onChange={setContent}
                />
            </Form.Item>
            <Row>
                <Col span={24} offset={1}>
                    <Button className="mr-3" onClick={() => history.goBack()}>取消</Button>
                    <Button type="primary" htmlType="submit">确定</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default PostEdit