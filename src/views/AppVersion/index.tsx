import React, { useEffect, useState } from "react"
import { Button, Col, Form, message, Modal, Popconfirm, Row, Select, Space, Table, Tag } from "antd"
import { PlusOutlined } from '@ant-design/icons'
import { AppVersion } from "../../types"
import AppVersionApi, { AppVersionFindListParams } from "../../api/AppVersionApi"
import AppVersionAdd from "./AppVersionAdd"
import AppVersionEdit from "./AppVersionEdit"


const params: AppVersionFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    device: undefined
}

function AppVersionList() {
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<AppVersion[]>([])
    const [ total, setTotal ] = useState(0)
    const [ form ] = Form.useForm()
    const [ isAddModalVisible, setIsAddModalVisible ] = useState(false)
    const [ isEditModalVisible, setIsEditModalVisible ] = useState(false)
    const [ currentId, setCurrentId ] = useState<number>()

    const getList = () => {
        setLoading(true)
        AppVersionApi.findList(params).then(res => {
            setTotal(res.data.data.total)
            const rows = res.data.data.list.map((item: AppVersion) => ({
                key: item.id,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const onFinish = ({ device }: any) => {
        params.device = device || undefined
        getList()
    }

    const del = (item: AppVersion) => {
        if (!item.id) {
            message.error('linkId不能为空！')
            return
        }
        AppVersionApi.del({ id: item.id }).then(res => {
            message.success('成功删除')
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
            width: 65
        },{
            title: '设备',
            dataIndex: 'device',
            key: 'device',
            width: 90,
            render: (device: number) => {
                return (<span>{device === 1 ? 'Android' : 'iOS'}</span>)
            }
        },{
            title: '最新版本',
            dataIndex: 'newVersion',
            key: 'newVersion',
            width: 120
        },{
            title: '最低支持版本',
            dataIndex: 'minVersion',
            key: 'minVersion',
            width: 120
        },{
            title: '是否更新',
            dataIndex: 'isUpdate',
            key: 'isUpdate',
            width: 90,
            render: (isUpdate: number) => {
                return (<span>{isUpdate === 1 ? '是' : '否'}</span>)
            }
        },{
            title: 'APP下载地址',
            dataIndex: 'appUrl',
            key: 'appUrl',
            ellipsis: true
        },{
            title: '更新内容',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 180
        },{
            title: '操作',
            key: 'action',
            width: 140,
            render: (text: any, record: AppVersion) => (
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
                <Row gutter={24}>
                    <Col span={6} key="device">
                        <Form.Item name="device" label="设备">
                            <Select
                                placeholder="请选择"
                                allowClear >
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value={1}>Android</Select.Option>
                                <Select.Option value={2}>iOS</Select.Option>
                            </Select>
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
                                params.device = undefined
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
                        title="添加版本" 
                        closable={false}
                        width={700}
                        visible={isAddModalVisible} 
                        footer={null}>
                        <AppVersionAdd 
                            handleOk={handleAddOk} 
                            handleCancel={() => setIsAddModalVisible(false)} />
                    </Modal>
                    : <></>
            }
            {
                isEditModalVisible && currentId
                    ? <Modal 
                        title="编辑版本" 
                        closable={false}
                        width={700}
                        visible={isEditModalVisible} 
                        footer={null}>
                        <AppVersionEdit 
                            id={currentId}
                            handleOk={handleEditOk} 
                            handleCancel={() => setIsEditModalVisible(false)} />
                    </Modal>
                    : <></>
            }
        </>
    )
}

export default AppVersionList