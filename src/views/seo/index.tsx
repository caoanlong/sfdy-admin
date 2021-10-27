import { 
    Table, 
    Tag, 
    Form, 
    Row, 
    Col, 
    Button, 
    Space, 
    Popconfirm, 
    Modal,
    message, 
    Select
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from "react"
import SeoAdd from "./SeoAdd"
import SeoEdit from "./SeoEdit"
import SeoApi, { SeoFindListParams } from "../../api/SeoApi"
import { Seo } from "../../types"
import { PLATFORM_MAP } from "../../utils/config"

const params: SeoFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    platform: undefined
}

function SeoList() {
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<Seo[]>([])
    const [ total, setTotal ] = useState(0)
    const [ form ] = Form.useForm()
    const [ isAddModalVisible, setIsAddModalVisible ] = useState(false)
    const [ isEditModalVisible, setIsEditModalVisible ] = useState(false)
    const [ currentId, setCurrentId ] = useState<number>()

    const getList = () => {
        setLoading(true)
        SeoApi.findList(params).then(res => {
            setTotal(res.data.data.total)
            const rows = res.data.data.list.map((item: Seo) => ({
                key: item.seoId,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const onFinish = ({ platform }: any) => {
        params.platform = platform || undefined
        getList()
    }

    const onPlatformChange = (value: number) => {
        form.setFieldsValue({ platform: value })
    }

    const del = (item: Seo) => {
        if (!item.seoId) {
            message.error('seoId不能为空！')
            return
        }
        SeoApi.del({ seoId: item.seoId }).then(res => {
            message.success('成功删除:' + item.seoTitle)
            getList()
        })
    }
    const handleEdit = (seoId?: number) => {
        setCurrentId(seoId)
        setIsEditModalVisible(true)
    }
    const handleAddOk = () => {
        setIsAddModalVisible(false)
        getList()
    }
    const handleEditOk = () => {
        setIsEditModalVisible(false)
        getList()
    }

    useEffect(() => {
        getList()
    }, [])

    const columns = [
        {
            title: '编号',
            dataIndex: 'seoId',
            key: 'seoId',
            width: 90
        },{
            title: '平台',
            dataIndex: 'platform',
            key: 'platform',
            width: 90,
            render: (platform: number) => PLATFORM_MAP[platform]
        },{
            title: '标题',
            dataIndex: 'seoTitle',
            key: 'seoTitle',
            ellipsis: true
        },{
            title: '关键词',
            dataIndex: 'seoKeywords',
            key: 'seoKeywords',
            ellipsis: true
        },{
            title: '描述',
            dataIndex: 'seoDescription',
            key: 'seoDescription',
            ellipsis: true
        },{
            title: '操作',
            key: 'action',
            width: 180,
            render: (text: any, record: Seo) => (
              <Space size="middle">
                <Tag 
                    color="#2db7f5" 
                    className="cursor-pointer" 
                    onClick={() => handleEdit(record?.seoId)}>
                    编辑
                </Tag>
                <Popconfirm
                    title="确定要删除吗？"
                    onConfirm={() => del(record)}
                    onCancel={() => {
                        message.info('已取消')
                    }}
                    okText="确定"
                    cancelText="取消">
                    <Tag color="#f50" className="cursor-pointer">删除</Tag>
                </Popconfirm>
              </Space>
            )
        }
    ]
    return (
        <>
            <Form
                name="advanced_search"
                className="bg-white m-4 p-3 shadow"
                form={form}
                onFinish={onFinish}>
                <Row gutter={24} className="block md:flex">
                    <Col span={6} className="max-w-full">
                        <Form.Item name="platform" label="平台">
                            <Select
                                placeholder="请选择"
                                allowClear 
                                onChange={onPlatformChange}>
                                <Select.Option value="">全部</Select.Option>
                                {
                                    Object.keys(PLATFORM_MAP).map((item: string, i: number) => (
                                        <Select.Option key={i} value={+item}>{PLATFORM_MAP[+item]}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Button 
                            type="primary"
                            icon={<PlusOutlined/>} 
                            onClick={() => setIsAddModalVisible(true)}>
                            添加
                        </Button>
                    </Col>
                    <Col span={16} className="text-right">
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                        <Button
                            className="ml-2"
                            onClick={() => {
                                form.resetFields()
                                params.platform = undefined
                                getList()
                            }}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Table 
                className="bg-white m-4 p-3 shadow" 
                scroll={{ x: 'max-content' }}
                columns={columns} 
                dataSource={list} 
                loading={loading}
                pagination={{
                    total,
                    showSizeChanger: true,
                    showTotal: t => `总数： ${t} 条`,
                    onChange: (pageIndex, pageSize) => {
                        params.pageIndex = pageIndex
                        params.pageSize = pageSize
                        getList()
                    }
                }}
                bordered>
            </Table>
            {
                isAddModalVisible
                    ? <Modal 
                        title="添加Seo" 
                        closable={false}
                        width={700}
                        visible={isAddModalVisible} 
                        footer={null}>
                        <SeoAdd 
                            handleOk={handleAddOk} 
                            handleCancel={() => setIsAddModalVisible(false)} />
                    </Modal>
                    : <></>
            }
            {
                isEditModalVisible && currentId
                    ? <Modal 
                        title="修改Seo" 
                        closable={false}
                        width={700}
                        visible={isEditModalVisible} 
                        footer={null}>
                        <SeoEdit 
                            seoId={currentId}
                            handleOk={handleEditOk} 
                            handleCancel={() => setIsEditModalVisible(false)} />
                    </Modal>
                    : <></>
            }
            
        </>
    )
}

export default SeoList