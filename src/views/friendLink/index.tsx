import { 
    Table, 
    Tag, 
    Form, 
    Row, 
    Col, 
    Button, 
    Input, 
    Space, 
    Popconfirm, 
    Modal,
    message, 
    Select
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from "react"
import dayjs from 'dayjs'
import { Link } from "../../types"
import LinkAdd from "./LinkAdd"
import LinkEdit from "./LinkEdit"
import LinkApi, { LinkFindListParams } from "../../api/LinkApi"
import { PLATFORM_MAP } from "../../utils/config"

const params: LinkFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    linkName: undefined,
    platform: undefined
}

function FriendLink() {
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<Link[]>([])
    const [ total, setTotal ] = useState(0)
    const [ form ] = Form.useForm()
    const [ isAddModalVisible, setIsAddModalVisible ] = useState(false)
    const [ isEditModalVisible, setIsEditModalVisible ] = useState(false)
    const [ currentLinkId, setCurrentLinkId ] = useState<number>()

    const getList = () => {
        setLoading(true)
        LinkApi.findList(params).then(res => {
            setTotal(res.data.data.total)
            const rows = res.data.data.list.map((item: Link) => ({
                key: item.linkId,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const onFinish = ({ linkName, platform }: any) => {
        params.linkName = linkName || undefined
        params.platform = platform || undefined
        getList()
    }

    const onPlatformChange = (value: number) => {
        form.setFieldsValue({ platform: value })
    }

    const del = (item: Link) => {
        if (!item.linkId) {
            message.error('linkId不能为空！')
            return
        }
        LinkApi.del({ linkId: item.linkId }).then(res => {
            message.success('成功删除:' + item.linkName)
            getList()
        })
    }
    const handleEdit = (linkId?: number) => {
        setCurrentLinkId(linkId)
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
            dataIndex: 'linkId',
            key: 'linkId',
            width: 90
        },{
            title: '平台',
            dataIndex: 'platform',
            key: 'platform',
            width: 90,
            render: (platform: number) => PLATFORM_MAP[platform]
        },{
            title: '名称',
            dataIndex: 'linkName',
            key: 'linkName',
            ellipsis: true
        },{
            title: '排序',
            dataIndex: 'linkSort',
            key: 'linkSort',
            width: 80
        },{
            title: '跳转链接',
            dataIndex: 'linkUrl',
            key: 'linkUrl',
            ellipsis: true
        },{
            title: '更新时间',
            dataIndex: 'linkTime',
            key: 'linkTime',
            width: 180,
            render: (time: number) => {
                return (<span>{dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>)
            }
        },{
            title: '操作',
            key: 'action',
            width: 140,
            render: (text: any, record: Link) => (
              <Space size="middle">
                <Tag 
                    color="#2db7f5" 
                    className="cursor-pointer" 
                    onClick={() => handleEdit(record?.linkId)}>
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
                        <Form.Item name="linkName" label="名称">
                            <Input placeholder="请输入..."/>
                        </Form.Item>
                    </Col>
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
                                params.linkName = undefined
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
                        title="添加友链" 
                        closable={false}
                        width={700}
                        visible={isAddModalVisible} 
                        footer={null}>
                        <LinkAdd 
                            handleOk={handleAddOk} 
                            handleCancel={() => setIsAddModalVisible(false)} />
                    </Modal>
                    : <></>
            }
            {
                isEditModalVisible
                    ? <Modal 
                        title="修改友链" 
                        closable={false}
                        width={700}
                        visible={isEditModalVisible} 
                        footer={null}>
                        <LinkEdit 
                            linkId={currentLinkId}
                            handleOk={handleEditOk} 
                            handleCancel={() => setIsEditModalVisible(false)} />
                    </Modal>
                    : <></>
            }
            
        </>
    )
}

export default FriendLink