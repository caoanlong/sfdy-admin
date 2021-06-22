import { Table, Tag, Space, Form, Row, Col, Button, Input, Select } from "antd"
import { UpOutlined, DownOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from "react"
import dayjs from 'dayjs'
import { long2ip } from '../../utils/tools'
import Admin, { AdminFindListParams } from "../../api/Admin"
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
    const [ pageIndex, setPageIndex ] = useState(1)
    const [ adminStatus, setAdminStatus ] = useState(undefined)
    const [ adminName, setAdminName ] = useState(undefined)

    const getList = () => {
        const data: AdminFindListParams = {
            pageIndex,
            pageSize: 10,
        }
        if (adminStatus !== undefined) {
            data.adminStatus = adminStatus
        }
        if (adminName !== undefined) {
            data.adminName = adminName
        }
        Admin.findList(data).then(res => {
            console.log(res.data.data)
            const rows = res.data.data.list.map((item: User) => ({
                key: item.adminId,
                adminName: item.adminName,
                adminStatus: item.adminStatus,
                adminLoginIp: item.adminLoginIp,
                adminLastLoginIp: item.adminLastLoginIp,
                adminLoginTime: item.adminLoginTime,
                adminLastLoginTime: item.adminLastLoginTime,
                adminLoginNum: item.adminLoginNum
            }))
            setList(rows)
            setTotal(res.data.data.total)
        })
    }

    const onFinish = (values: any) => {
        setAdminName(values.adminName)
        setAdminStatus(values.adminStatus)
        getList()
        console.log('Received values of form: ', values)
    }

    useEffect(() => {
        getList()
    }, [])

    return (
        <div>
            <Form
                name="advanced_search"
                className="bg-white m-4 p-3 shadow"
                onFinish={onFinish}>
                <Row gutter={24}>
                    <Col span={6} key="1">
                        <Form.Item name="adminName" label="名称">
                            <Input placeholder="请输入..." value={adminName}/>
                        </Form.Item>
                    </Col>
                    <Col span={6} key="2">
                        <Form.Item name="adminStatus" label="状态">
                            <Select
                                placeholder="请选择"
                                allowClear value={adminStatus}>
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
                                setAdminStatus(undefined)
                                setAdminName(undefined)
                                getList()
                            }}>
                            重置
                        </Button>
                    </Col>
                </Row>
                </Form>
            <Table className="bg-white m-4 p-3 shadow" columns={columns} dataSource={list} bordered/>
        </div>
    )
}

export default SysUser