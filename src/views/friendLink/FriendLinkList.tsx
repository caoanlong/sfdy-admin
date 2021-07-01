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
import { Link } from "../../types"
import LinkAdd from "./LinkAdd"
import LinkEdit from "./LinkEdit"
import LinkApi, { LinkFindListParams } from "../../api/LinkApi"

const params: LinkFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    linkName: undefined
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

    const onFinish = ({ linkName }: any) => {
        params.linkName = linkName || undefined
        getList()
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
    const handleEdit = (bannerId?: number) => {
        setCurrentLinkId(bannerId)
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
                <Row gutter={24}>
                    <Col span={6} key="linkName">
                        <Form.Item name="linkName" label="名称">
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
                                params.linkName = undefined
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
                        title="添加友链" 
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