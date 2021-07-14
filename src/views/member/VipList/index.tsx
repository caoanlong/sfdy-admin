import React, { useEffect, useState } from "react"
import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Space, Table, Tag } from "antd"
import { PlusOutlined } from '@ant-design/icons'
import { Vip } from "../../../types"
import VipApi, { VipFindListParams } from "../../../api/VipApi"
import dayjs from "dayjs"
import VipAdd from "./VipAdd"
import { SITE_NAME } from "../../../utils/consts"
import VipEdit from "./VipEdit"


const params: VipFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    vipName: undefined
}

function VipList() {
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<Vip[]>([])
    const [ total, setTotal ] = useState(0)
    const [ form ] = Form.useForm()
    const [ isAddModalVisible, setIsAddModalVisible ] = useState(false)
    const [ isEditModalVisible, setIsEditModalVisible ] = useState(false)
    const [ currentVipId, setCurrentVipId ] = useState<number>()

    const getList = () => {
        setLoading(true)
        VipApi.findList(params).then(res => {
            setTotal(res.data.data.total)
            const rows = res.data.data.list.map((item: Vip) => ({
                key: item.vipId,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const onFinish = ({ vipName }: any) => {
        params.vipName = vipName || undefined
        getList()
    }

    const del = (item: Vip) => {
        if (!item.vipId) {
            message.error('vipId不能为空！')
            return
        }
        VipApi.del({ vipId: item.vipId }).then(res => {
            message.success('成功删除:' + item.vipName)
            getList()
        })
    }
    const handleEdit = (vipId?: number) => {
        setCurrentVipId(vipId)
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
            dataIndex: 'vipId',
            key: 'vipId',
            width: 70
        },{
            title: '图标',
            dataIndex: 'vipIcon',
            key: 'vipIcon',
            width: 100,
            render: (icon: string) => {
                return (icon ? <img className="w-5 h-5" src={SITE_NAME + icon} alt="icon"/> : <></>)
            }
        },{
            title: '等级',
            dataIndex: 'level',
            key: 'level',
            width: 80
        },{
            title: '名称',
            dataIndex: 'vipName',
            key: 'vipName',
            ellipsis: true
        },{
            title: '有效时间',
            dataIndex: 'validDays',
            key: 'validDays',
            render: (validDays: number) => {
                return (validDays + '天')
            }
        },{
            title: '修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 180,
            render: (time: Date) => {
                return (<span>{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</span>)
            }
        },{
            title: '操作',
            key: 'action',
            width: 140,
            render: (text: any, record: Vip) => (
              <Space size="middle">
                <Tag 
                    color="#2db7f5" 
                    className="cursor-pointer" 
                    onClick={() => handleEdit(record?.vipId)}>
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
                    <Col span={6} key="vipName">
                        <Form.Item name="vipName" label="名称">
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
                                params.vipName = undefined
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
                    title="添加VIP" 
                    closable={false}
                    width={700}
                    visible={isAddModalVisible} 
                    footer={null}>
                    <VipAdd 
                        handleOk={handleAddOk} 
                        handleCancel={() => setIsAddModalVisible(false)} />
                </Modal>
                : <></>
            }
            {
                isEditModalVisible
                    ? <Modal 
                        title="修改VIP" 
                        closable={false}
                        width={700}
                        visible={isEditModalVisible} 
                        footer={null}>
                        <VipEdit 
                            vipId={currentVipId}
                            handleOk={handleEditOk} 
                            handleCancel={() => setIsEditModalVisible(false)} />
                    </Modal>
                    : <></>
            }
        </>
    )
}

export default VipList