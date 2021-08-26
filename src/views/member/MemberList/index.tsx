import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Space, Table, Tag } from "antd"
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"
import MemberApi, { MemberFindListParams } from "../../../api/MemberApi"
import { Member } from "../../../types"
import { SITE_NAME } from "../../../utils/consts"
import MemberEdit from "./MemberEdit"

const params: MemberFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    memberName: undefined
}

function MemberList() {
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<Member[]>([])
    const [ total, setTotal ] = useState(0)
    const [ form ] = Form.useForm()
    const [ isEditModalVisible, setIsEditModalVisible ] = useState(false)
    const [ currentMemberId, setCurrentMemberId ] = useState<number>()

    const getList = () => {
        setLoading(true)
        MemberApi.findList(params).then(res => {
            setTotal(res.data.data.total)
            const rows = res.data.data.list.map((item: Member) => ({
                key: item.memberId,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const onFinish = ({ memberName }: any) => {
        params.memberName = memberName || undefined
        getList()
    }

    const del = (item: Member) => {
        if (!item.memberId) {
            message.error('memberId不能为空！')
            return
        }
        MemberApi.del({ memberId: item.memberId }).then(res => {
            message.success('成功删除:' + item.memberName)
            getList()
        })
    }
    const handleEdit = (memberId?: number) => {
        setCurrentMemberId(memberId)
        setIsEditModalVisible(true)
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
            dataIndex: 'memberId',
            key: 'memberId',
            width: 70
        },{
            title: '名称',
            dataIndex: 'memberName',
            key: 'memberName',
            ellipsis: true
        },{
            title: 'VIP等级',
            dataIndex: 'level',
            key: 'level'
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
            render: (text: any, record: Member) => (
              <Space size="middle">
                <Tag 
                    color="#2db7f5" 
                    className="cursor-pointer" 
                    onClick={() => handleEdit(record?.memberId)}>
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
                    <Col span={12} className="text-right">
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                        <Button
                            className="mx-2"
                            onClick={() => {
                                form.resetFields()
                                params.memberName = undefined
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
                isEditModalVisible
                    ? <Modal 
                        title="修改VIP" 
                        closable={false}
                        width={700}
                        visible={isEditModalVisible} 
                        footer={null}>
                        <MemberEdit 
                            vipId={currentMemberId}
                            handleOk={handleEditOk} 
                            handleCancel={() => setIsEditModalVisible(false)} />
                    </Modal>
                    : <></>
            }
        </>
    )
}

export default MemberList