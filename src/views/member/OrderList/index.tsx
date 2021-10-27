import React, { useEffect, useState } from "react"
import { Button, Col, Form, Input, Row, Select, Table } from "antd"
import { Order } from "../../../types"
import dayjs from "dayjs"
import OrderApi, { OrderFindListParams } from "../../../api/OrderApi"
import { PLATFORM_MAP } from "../../../utils/config"


const params: OrderFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    orderNo: undefined,
    platform: undefined,
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

    const onFinish = ({ orderNo, platform, type, status }: { 
        orderNo: string, 
        platform: number, 
        type: number, 
        status: number 
    }) => {
        params.orderNo = orderNo || undefined
        params.platform = platform || undefined
        params.type = type || undefined
        params.status = status || undefined
        getList()
    }

    const onPlatformChange = (value: number) => {
        form.setFieldsValue({ platform: value })
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
            width: 220,
        },{
            title: '平台',
            dataIndex: 'platform',
            key: 'platform',
            width: 80,
            render: (platform: number) => PLATFORM_MAP[platform]
        },{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true
        },{
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 65,
            render: (type: number) => {
                return (TYPE_MAP[type])
            }
        },{
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            width: 85,
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
            key: 'memberEmail',
            width: 220
        },{
            title: '用户手机',
            dataIndex: 'memberMobile',
            key: 'memberMobile',
            width: 130,
        },{
            title: '支付IP',
            dataIndex: 'payIp',
            key: 'payIp',
            width: 150,
            ellipsis: true
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
                <Row gutter={24} className="block md:flex">
                    <Col span={6} className="max-w-full">
                        <Form.Item name="orderNo" label="订单号">
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
                                <Select.Option value={1}>巨硬AV</Select.Option>
                                <Select.Option value={2}>凤楼</Select.Option>
                                <Select.Option value={5}>快充</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6} className="max-w-full">
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
                    <Col span={6} className="max-w-full">
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
                <Row className="justify-end">
                    <Button type="primary" htmlType="submit">
                        搜索
                    </Button>
                    <Button
                        className="ml-2"
                        onClick={() => {
                            form.resetFields()
                            params.orderNo = undefined
                            params.status = undefined
                            params.type = undefined
                            params.platform = undefined
                            getList()
                        }}>
                        重置
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
        </>
    )
}

export default OrderList