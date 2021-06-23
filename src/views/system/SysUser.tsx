import { Table, Tag, Form, Row, Col, Button, Input, Select } from "antd"
import React, { useEffect, useState } from "react"
import dayjs from 'dayjs'
import { long2ip } from '../../utils/tools'
import AdminApi, { AdminFindListParams } from "../../api/AdminApi"
import { User } from "../../types"

const columns = [
    {
        title: '名称',
        dataIndex: 'adminName',
        key: 'adminName'
    },{
        title: '状态',
        dataIndex: 'adminStatus',
        key: 'adminStatus',
        render: (status: number) => {
            if (status === 1) {
                return (<Tag color="green">已启用</Tag>)
            } else {
                return (<Tag color="red">已禁用</Tag>)
            }
        }
    },{
        title: '登录IP',
        dataIndex: 'adminLoginIp',
        key: 'adminLoginIp',
        render: (longIp: number) => {
            return (<span>{long2ip(longIp)}</span>)
        }
    },{
        title: '上次登录IP',
        dataIndex: 'adminLastLoginIp',
        key: 'adminLastLoginIp',
        render: (longIp: number) => {
            return (<span>{long2ip(longIp)}</span>)
        }
    },{
        title: '登录时间',
        dataIndex: 'adminLoginTime',
        key: 'adminLoginTime',
        render: (time: number) => {
            return (<span>{dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>)
        }
    },{
        title: '上次登录时间',
        dataIndex: 'adminLastLoginTime',
        key: 'adminLastLoginTime',
        render: (time: number) => {
            return (<span>{dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>)
        }
    },{
        title: '登录次数',
        dataIndex: 'adminLoginNum',
        key: 'adminLoginNum',
    }
]

function SysUser() {

    const [ list, setList ] = useState([])
    const [ total, setTotal ] = useState(0)
    let pageIndex = 1, pageSize = 10
    const [ form ] = Form.useForm()

    const getList = (data?: AdminFindListParams) => {
        AdminApi.findList({
            pageIndex,
            pageSize,
            ...data
        }).then(res => {
            const rows = res.data.data.list.map((item: User) => ({
                key: item.adminId,
                ...item
            }))
            setList(rows)
            setTotal(res.data.data.total)
        })
    }

    const onFinish = (values: any) => {
        getList({
            adminStatus: values.adminStatus,
            adminName: values.adminName
        })
    }

    useEffect(() => {
        getList()
    }, [])

    return (
        <div>
            <Form
                name="advanced_search"
                className="bg-white m-4 p-3 shadow"
                form={form}
                onFinish={onFinish}>
                <Row gutter={24}>
                    <Col span={6} key="1">
                        <Form.Item name="adminName" label="名称">
                            <Input placeholder="请输入..."/>
                        </Form.Item>
                    </Col>
                    <Col span={6} key="2">
                        <Form.Item name="adminStatus" label="状态">
                            <Select
                                placeholder="请选择"
                                allowClear>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value={1}>已启用</Select.Option>
                                <Select.Option value={0}>已禁用</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className="text-right">
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                        <Button
                            className="mx-2"
                            onClick={() => {
                                form.resetFields()
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
                pagination={{
                    total,
                    showSizeChanger: true,
                    showTotal: total => `总数： ${total} 条`,
                    onChange: (page, size) => {
                        console.log(page, size)
                        pageIndex = page
                        pageSize = size ?? pageSize
                        getList()
                    }
                }}
                bordered>
            </Table>
        </div>
    )
}

export default SysUser