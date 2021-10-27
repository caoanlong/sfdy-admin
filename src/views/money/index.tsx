import { 
    Table, 
    Tag, 
    Row, 
    Col, 
    Button,
    Space, 
    Popconfirm, 
    Modal,
    message,
    Form, 
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from "react"
import MoneyAdd from "./MoneyAdd"
import MoneyEdit from "./MoneyEdit"
import MoneyApi, { MoneyFindListParams } from "../../api/MoneyApi"
import { Money } from "../../types"
import dayjs from "dayjs"

const params: MoneyFindListParams = {
    pageIndex: 1,
    pageSize: 10
}

function MoneyList() {
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<Money[]>([])
    const [ total, setTotal ] = useState(0)
    const [ isAddModalVisible, setIsAddModalVisible ] = useState(false)
    const [ isEditModalVisible, setIsEditModalVisible ] = useState(false)
    const [ currentId, setCurrentId ] = useState<number>()

    const getList = () => {
        setLoading(true)
        MoneyApi.findList(params).then(res => {
            setTotal(res.data.data.total)
            const rows = res.data.data.list.map((item: Money) => ({
                key: item.id,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const del = (item: Money) => {
        if (!item.id) {
            message.error('id不能为空！')
            return
        }
        MoneyApi.del({ id: item.id }).then(res => {
            message.success('成功删除:' + item.price)
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
            title: '面额',
            dataIndex: 'price',
            key: 'price',
            ellipsis: true
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (time: Date) => {
                return (<span>{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</span>)
            }
        },{
            title: '修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: (time: Date) => {
                return (<span>{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</span>)
            }
        },{
            title: '操作',
            key: 'action',
            width: 180,
            render: (text: any, record: Money) => (
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
                    <Col span={12}>
                        <Button 
                            type="primary"
                            icon={<PlusOutlined/>} 
                            onClick={() => setIsAddModalVisible(true)}>
                            添加
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
                        title="添加充值面额" 
                        closable={false}
                        width={700}
                        visible={isAddModalVisible} 
                        footer={null}>
                        <MoneyAdd 
                            handleOk={handleAddOk} 
                            handleCancel={() => setIsAddModalVisible(false)} />
                    </Modal>
                    : <></>
            }
            {
                isEditModalVisible && currentId
                    ? <Modal 
                        title="修改充值面额" 
                        closable={false}
                        width={700}
                        visible={isEditModalVisible} 
                        footer={null}>
                        <MoneyEdit 
                            id={currentId}
                            handleOk={handleEditOk} 
                            handleCancel={() => setIsEditModalVisible(false)} />
                    </Modal>
                    : <></>
            }
            
        </>
    )
}

export default MoneyList