import React, { useEffect, useState } from "react"
import { Button, Col, Form, Input, message, Modal, Row, Select, Table } from "antd"
import { Order } from "../../../types"
import dayjs from "dayjs"
import OrderApi, { OrderFindListParams } from "../../../api/OrderApi"


const params: OrderFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    orderNo: undefined,
    type: undefined,
    status: undefined
}

const STATUS_MAP: {[key: number]: { style: string, text: string }} = {
    1: { style: 'text-yellow-500', text: '确认中' },
    2: { style: 'text-green-500', text: '成功' },
    3: { style: 'text-red-500', text: '失败' }
}
const TYPE_MAP: {[key: number]: string} = {
    1: '充值',
    2: '提现',
    3: '佣金'
}

function OrderList() {
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<Order[]>([])
    const [ total, setTotal ] = useState(0)
    const [ form ] = Form.useForm()

    const getList = () => {
        setLoading(true)
        OrderApi.findList(params).then(res => {
            setTotal(res.data.data.total)
            const rows = res.data.data.list.map((item: Order) => ({
                key: item.orderId,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const onFinish = ({ orderNo, type, status }: { orderNo: string, type: number, status: number }) => {
        params.orderNo = orderNo || undefined
        params.type = type || undefined
        params.status = status || undefined
        getList()
    }

    const onTypeChange = (value: number) => {
        form.setFieldsValue({ type: value })
    }
    const onStatusChange = (value: number) => {
        form.setFieldsValue({ status: value })
    }

    useEffect(() => {
        getList()
    }, [])

    const columns = [
        {
            title: '编号',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 65
        },{
            title: '订单号',
            dataIndex: 'orderNo',
            key: 'orderNo',
            width: 150,
        },{
            title: '标题',
            dataIndex: 'title',
            key: 'title'
        },{
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 70,
            render: (type: number) => {
                return (TYPE_MAP[type])
            }
        },{
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => {
                return (amount + '元')
            }
        },{
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status: number) => {
                return <span className={STATUS_MAP[status].style}>{STATUS_MAP[status].text}</span>
            }
        },{
            title: '用户邮箱',
            dataIndex: 'memberEmail',
            key: 'memberEmail'
        },{
            title: '用户手机',
            dataIndex: 'memberMobile',
            key: 'memberMobile'
        },{
            title: '支付IP',
            dataIndex: 'payIp',
            key: 'payIp',
            width: 130,
        },{
            title: '额外信息',
            dataIndex: 'extraInfo',
            key: 'extraInfo'
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 180,
            render: (time: Date) => {
                return (<span>{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</span>)
            }
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
                    <Col span={6} key="orderNo">
                        <Form.Item name="orderNo" label="订单号">
                            <Input placeholder="请输入..."/>
                        </Form.Item>
                    </Col>
                    <Col span={6} key="type">
                        <Form.Item name="type" label="类型">
                            <Select
                                placeholder="请选择"
                                allowClear 
                                onChange={onTypeChange}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value={1}>充值</Select.Option>
                                <Select.Option value={2}>提现</Select.Option>
                                <Select.Option value={3}>佣金</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6} key="status">
                        <Form.Item name="status" label="状态">
                            <Select
                                placeholder="请选择"
                                allowClear 
                                onChange={onStatusChange}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value={1}>确认中</Select.Option>
                                <Select.Option value={2}>完成</Select.Option>
                                <Select.Option value={3}>失败</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12} offset={10}>
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                        <Button
                            className="mx-2"
                            onClick={() => {
                                form.resetFields()
                                params.orderNo = undefined
                                params.status = undefined
                                params.type = undefined
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
        </>
    )
}

export default OrderList