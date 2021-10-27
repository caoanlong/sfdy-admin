import { 
    Table, 
    Tag, 
    Row, 
    Button,
    Space, 
    Popconfirm, 
    Modal,
    message,
    Form, 
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from "react"
import NoticeAdd from "./NoticeAdd"
import NoticeEdit from "./NoticeEdit"
import { Notice } from "../../types"
import { PLATFORM_MAP } from "../../utils/config"
import NoticeApi, { NoticeFindListParams } from "../../api/NoticeApi"

const params: NoticeFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    platform: undefined
}

function NoticeList() {
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<Notice[]>([])
    const [ total, setTotal ] = useState(0)
    const [ isAddModalVisible, setIsAddModalVisible ] = useState(false)
    const [ isEditModalVisible, setIsEditModalVisible ] = useState(false)
    const [ currentId, setCurrentId ] = useState<number>()

    const getList = () => {
        setLoading(true)
        NoticeApi.findList(params).then(res => {
            setTotal(res.data.data.total)
            const rows = res.data.data.list.map((item: Notice) => ({
                key: item.id,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const del = (item: Notice) => {
        if (!item.id) {
            message.error('id不能为空！')
            return
        }
        NoticeApi.del({ id: item.id }).then(res => {
            message.success('成功删除:' + item.title)
            getList()
        })
    }
    const handleEdit = (id?: number) => {
        setCurrentId(id)
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
            dataIndex: 'id',
            key: 'id',
            width: 90
        },{
            title: '平台',
            dataIndex: 'platform',
            key: 'platform',
            width: 90,
            render: (platform: number) => PLATFORM_MAP[platform]
        },{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true
        },{
            title: '操作',
            key: 'action',
            width: 180,
            render: (text: any, record: Notice) => (
              <Space size="middle">
                <Tag 
                    color="#2db7f5" 
                    className="cursor-pointer" 
                    onClick={() => handleEdit(record?.id)}>
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
                className="bg-white m-4 p-3 shadow">
                <Row>
                    <Button 
                        type="primary"
                        icon={<PlusOutlined/>} 
                        onClick={() => setIsAddModalVisible(true)}>
                        添加
                    </Button>
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
                        title="添加公告" 
                        closable={false}
                        width={700}
                        visible={isAddModalVisible} 
                        footer={null}>
                        <NoticeAdd 
                            handleOk={handleAddOk} 
                            handleCancel={() => setIsAddModalVisible(false)} />
                    </Modal>
                    : <></>
            }
            {
                isEditModalVisible && currentId
                    ? <Modal 
                        title="修改公告" 
                        closable={false}
                        width={700}
                        visible={isEditModalVisible} 
                        footer={null}>
                        <NoticeEdit 
                            id={currentId}
                            handleOk={handleEditOk} 
                            handleCancel={() => setIsEditModalVisible(false)} />
                    </Modal>
                    : <></>
            }
            
        </>
    )
}

export default NoticeList