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
    message 
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import { useEffect, useState } from "react"
import dayjs from 'dayjs'
import BannerApi, { BannerFindListParams } from "../../api/BannerApi"
import { Banner } from "../../types"
import BannerAdd from "./BannerAdd"
import BannerEdit from "./BannerEdit"

export const BANNER_TYPES: { [key: string]: string} = {
    '1': '全部',
    '2': 'H5',
    '3': 'APP'
}


const params: BannerFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    bannerName: undefined
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

    const onFinish = ({ bannerName }: any) => {
        params.bannerName = bannerName || undefined
        getList()
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
            title: '类型',
            dataIndex: 'bannerType',
            key: 'bannerType',
            width: 110,
            render: (type: number) => (BANNER_TYPES[type])
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
                <Row gutter={24}>
                    <Col span={6} key="bannerName">
                        <Form.Item name="bannerName" label="名称">
                            <Input placeholder="请输入..."/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Button 
                            type="primary"
                            icon={<PlusOutlined/>} 
                            onClick={() => setIsAddModalVisible(true)}>
                            添加
                        </Button>
                    </Col>
                    <Col span={12} className="text-right">
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                        <Button
                            className="mx-2"
                            onClick={() => {
                                form.resetFields()
                                params.bannerName = undefined
                                getList()
                            }}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Table 
                className="bg-white m-4 p-3 shadow" 
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