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
import React, { useEffect, useState } from "react"
import ProvinceApi, { ProvinceFindListParams } from "../../api/ProvinceApi"
import { Province } from "../../types"
import ProvinceAdd from "./ProvinceAdd"
import ProvinceEdit from "./ProvinceEdit"

const params: ProvinceFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    name: undefined
}

function Provinces() {
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<Province[]>([])
    const [ total, setTotal ] = useState(0)
    const [ form ] = Form.useForm()
    const [ isAddModalVisible, setIsAddModalVisible ] = useState(false)
    const [ isEditModalVisible, setIsEditModalVisible ] = useState(false)
    const [ currentId, setCurrentId ] = useState<number>()

    const getList = () => {
        setLoading(true)
        ProvinceApi.findList(params).then(res => {
            setTotal(res.data.data.total)
            const rows = res.data.data.list.map((item: Province) => ({
                key: item.id,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const onFinish = ({ name }: any) => {
        params.name = name || undefined
        getList()
    }

    const del = (item: Province) => {
        if (!item.id) {
            message.error('id不能为空！')
            return
        }
        ProvinceApi.del({ id: item.id }).then(res => {
            message.success('成功删除:' + item.name)
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
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true
        },{
            title: '名称code',
            dataIndex: 'ename',
            key: 'ename',
            ellipsis: true
        },{
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
            width: 100
        },{
            title: '操作',
            key: 'action',
            width: 180,
            render: (text: any, record: Province) => (
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
                className="bg-white m-4 p-3 shadow"
                form={form}
                onFinish={onFinish}>
                <Row gutter={24} className="block md:flex">
                    <Col span={6} className="max-w-full">
                        <Form.Item name="name" label="名称">
                            <Input placeholder="请输入..."/>
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
                                params.name = undefined
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
                    defaultCurrent: params.pageIndex,
                    showQuickJumper: true,
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
                        title="添加省份" 
                        closable={false}
                        width={700}
                        visible={isAddModalVisible} 
                        footer={null}>
                        <ProvinceAdd 
                            handleOk={handleAddOk} 
                            handleCancel={() => setIsAddModalVisible(false)} />
                    </Modal>
                    : <></>
            }
            {
                isEditModalVisible && currentId
                    ? <Modal 
                        title="修改省份" 
                        closable={false}
                        width={700}
                        visible={isEditModalVisible} 
                        footer={null}>
                        <ProvinceEdit 
                            id={currentId}
                            handleOk={handleEditOk} 
                            handleCancel={() => setIsEditModalVisible(false)} />
                    </Modal>
                    : <></>
            }
            
        </>
    )
}

export default Provinces