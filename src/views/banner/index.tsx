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
import BannerApi, { BannerFindListParams } from "../../api/BannerApi"
import { Banner } from "../../types"
import BannerAdd from "./BannerAdd"
import BannerEdit from "./BannerEdit"
import { DEVICE_TYPES, PLATFORM_MAP } from "../../utils/config"


const params: BannerFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    bannerName: undefined,
    platform: undefined
}
function BannerList() {
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<Banner[]>([])
    const [ total, setTotal ] = useState(0)
    const [ form ] = Form.useForm()
    const [ isAddModalVisible, setIsAddModalVisible ] = useState(false)
    const [ isEditModalVisible, setIsEditModalVisible ] = useState(false)
    const [ currentBannerId, setCurrentBannerId ] = useState<number>()
    
    const getList = () => {
        setLoading(true)
        BannerApi.findList(params).then(res => {
            setTotal(res.data.data.total)
            const rows = res.data.data.list.map((item: Banner) => ({
                key: item.bannerId,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const onFinish = ({ bannerName, platform }: any) => {
        params.bannerName = bannerName || undefined
        params.platform = platform || undefined
        getList()
    }

    const onPlatformChange = (value: number) => {
        form.setFieldsValue({ platform: value })
    }

    const del = (item: Banner) => {
        if (!item.bannerId) {
            message.error('bannerId不能为空！')
            return
        }
        BannerApi.del({ bannerId: item.bannerId }).then(res => {
            message.success('成功删除:' + item.bannerName)
            getList()
        })
    }
    const handleEdit = (bannerId?: number) => {
        setCurrentBannerId(bannerId)
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
            dataIndex: 'bannerId',
            key: 'bannerId',
            width: 90
        },{
            title: '名称',
            dataIndex: 'bannerName',
            key: 'bannerName',
            ellipsis: true
        },{
            title: '平台',
            dataIndex: 'platform',
            key: 'platform',
            width: 90,
            render: (platform: number) => PLATFORM_MAP[platform]
        },{
            title: '类型',
            dataIndex: 'bannerType',
            key: 'bannerType',
            width: 90,
            render: (type: number) => (DEVICE_TYPES[type])
        },{
            title: '排序',
            dataIndex: 'bannerSort',
            key: 'bannerSort',
            width: 80
        },{
            title: '跳转链接',
            dataIndex: 'bannerLink',
            key: 'bannerLink',
            ellipsis: true
        },{
            title: '更新时间',
            dataIndex: 'bannerTime',
            key: 'bannerTime',
            width: 180,
            render: (time: Date) => {
                return (<span>{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</span>)
            }
        },{
            title: '操作',
            key: 'action',
            width: 140,
            render: (text: any, record: Banner) => (
              <Space size="middle">
                <Tag 
                    color="#2db7f5" 
                    className="cursor-pointer" 
                    onClick={() => handleEdit(record?.bannerId)}>
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
                        <Form.Item name="bannerName" label="名称">
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
                                    Object.keys(PLATFORM_MAP).map((item: string) => (
                                        <Select.Option value={+item}>{PLATFORM_MAP[+item]}</Select.Option>
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
                                params.bannerName = undefined
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
                    title="添加Banner" 
                    closable={false}
                    width={700}
                    visible={isAddModalVisible} 
                    footer={null}>
                    <BannerAdd 
                        handleOk={handleAddOk} 
                        handleCancel={() => setIsAddModalVisible(false)} />
                </Modal>
                : <></>
            }
            {
                isEditModalVisible
                    ? <Modal 
                        title="修改Banner" 
                        closable={false}
                        width={700}
                        visible={isEditModalVisible} 
                        footer={null}>
                        <BannerEdit 
                            bannerId={currentBannerId}
                            handleOk={handleEditOk} 
                            handleCancel={() => setIsEditModalVisible(false)} />
                    </Modal>
                    : <></>
            }
            
        </>
    )
}

export default BannerList