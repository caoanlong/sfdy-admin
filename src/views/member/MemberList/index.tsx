import { 
    Button, 
    Col, 
    Form, 
    Input, 
    message, 
    Modal, 
    Popconfirm, 
    Row, 
    Select, 
    Space, 
    Table, 
    Tag 
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"
import MemberApi, { MemberFindListParams } from "../../../api/MemberApi"
import { Member, Vip } from "../../../types"
import MemberEdit from "./MemberEdit"
import MemberAdd from "./MemberAdd"
import VipApi from "../../../api/VipApi"
import MemberEditVIP from "./MemberEditVIP"
import { PLATFORM_MAP } from "../../../utils/config"
import { isFixedMenu } from "../../../utils/tools"

const params: MemberFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    platform: undefined,
    memberName: undefined,
    mobile: undefined,
    email: undefined,
    isAgent: undefined,
    status: undefined,
    regType: undefined
}

function MemberList() {
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<Member[]>([])
    const [ total, setTotal ] = useState(0)
    const [ form ] = Form.useForm()
    const [ isAddModalVisible, setIsAddModalVisible ] = useState(false)
    const [ isEditModalVisible, setIsEditModalVisible ] = useState(false)
    const [ isEditVIPModalVisible, setIsEditVIPModalVisible ] = useState(false)
    const [ currentMemberId, setCurrentMemberId ] = useState<number>()
    const [ vips, setVips ] = useState<Vip[]>([])

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
    const getVips = () => {
        VipApi.findAll().then(res => {
            setVips(res.data.data)
        })
    }

    const onFinish = ({ platform, memberName, mobile, email, isAgent, status, regType }: any) => {
        params.platform = platform || undefined
        params.memberName = memberName || undefined
        params.mobile = mobile || undefined
        params.email = email || undefined
        params.isAgent = (isAgent || isAgent === 0) ? isAgent : undefined
        params.status = (status || status === 0) ? status : undefined
        params.regType = (regType || regType === 0) ? regType : undefined
        getList()
    }
    const onPlatformChange = (value: number) => {
        form.setFieldsValue({ platform: value })
    }
    const onIsAgentChange = (value: number) => {
        form.setFieldsValue({ isAgent: value })
    }
    const onIsStatusChange = (value: number) => {
        form.setFieldsValue({ status: value })
    }
    const onIsRegTypeChange = (value: number) => {
        form.setFieldsValue({ regType: value })
    }

    const del = (item: Member) => {
        if (!item.memberId) {
            message.error('memberId不能为空！')
            return
        }
        MemberApi.del({ memberId: item.memberId }).then(res => {
            message.success('成功删除:' + (item.memberName || item.mobile || item.email))
            getList()
        })
    }
    const handleEdit = (memberId?: number) => {
        setCurrentMemberId(memberId)
        setIsEditModalVisible(true)
    }
    const handleEditVIP = (memberId?: number) => {
        setCurrentMemberId(memberId)
        setIsEditVIPModalVisible(true)
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
        getVips()
    }, [])
    
    const columns = [
        {
            title: '编号',
            dataIndex: 'memberId',
            key: 'memberId',
            width: 65,
        },{
            title: '平台',
            dataIndex: 'platform',
            key: 'platform',
            width: 80,
            render: (platform: number) => PLATFORM_MAP[platform]
        },{
            title: '邮箱',
            dataIndex: 'email',
            key: 'email'
        },{
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',
            width: 130,
        },{
            title: '代理',
            dataIndex: 'isAgent',
            key: 'isAgent',
            width: 60,
            render: (isAgent: number) => {
                if (isAgent === 1) return <Tag color="magenta">是</Tag>
                return <Tag color="cyan">否</Tag>
            }
        },{
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 60,
            render: (status: number) => {
                if (status === 1) return <Tag color="green">正常</Tag>
                return <Tag color="red">禁用</Tag>
            }
        },{
            title: '注册类型',
            dataIndex: 'regType',
            key: 'regType',
            width: 90,
            render: (regType: number) => {
                if (regType === 1) return (<span>手机</span>)
                if (regType === 2) return (<span>邮箱</span>)
                if (regType === 3) return (<span>账号密码</span>)
                return (<span>管理添加</span>)
            }
        },{
            title: '充值总额',
            dataIndex: 'totalRecharge',
            key: 'totalRecharge',
            width: 90,
        },{
            title: '余额',
            dataIndex: 'balance',
            key: 'balance',
            width: 80,
        },{
            title: '注册时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (time: Date) => {
                return (<span>{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</span>)
            }
        },{
            title: '登录时间',
            dataIndex: 'loginTime',
            key: 'loginTime',
            render: (time: Date) => {
                return (<span>{time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : ''}</span>)
            }
        },{
            title: '登录次数',
            dataIndex: 'loginNum',
            key: 'loginNum',
            width: 90
        },{
            title: '操作',
            key: 'action',
            width: 200,
            render: (text: any, record: Member) => (
              <Space size="middle">
                <Tag 
                    color="#2db7f5" 
                    className="cursor-pointer" 
                    onClick={() => handleEdit(record?.memberId)}>
                    编辑
                </Tag>
                <Tag 
                    color="#2db7f5" 
                    className="cursor-pointer" 
                    onClick={() => handleEditVIP(record?.memberId)}>
                    VIP
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
                        <Form.Item name="platform" label="平台">
                            <Select
                                placeholder="请选择"
                                allowClear 
                                onChange={onPlatformChange}>
                                <Select.Option key={-1} value="">全部</Select.Option>
                                {
                                    Object.keys(PLATFORM_MAP).map((item: string, i: number) => (
                                        <Select.Option key={i} value={+item}>{PLATFORM_MAP[+item]}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6} className="max-w-full">
                        <Form.Item name="memberName" label="名称">
                            <Input placeholder="请输入..."/>
                        </Form.Item>
                    </Col>
                    <Col span={6} className="max-w-full">
                        <Form.Item name="email" label="邮箱">
                            <Input placeholder="请输入..."/>
                        </Form.Item>
                    </Col>
                    <Col span={6} className="max-w-full">
                        <Form.Item name="mobile" label="手机号">
                            <Input placeholder="请输入..."/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24} className="block md:flex">
                    <Col span={6} className="max-w-full">
                        <Form.Item name="isAgent" label="是否代理">
                            <Select
                                placeholder="请选择"
                                allowClear 
                                onChange={onIsAgentChange}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value={1}>是</Select.Option>
                                <Select.Option value={0}>否</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6} className="max-w-full">
                        <Form.Item name="status" label="状态">
                        <Select
                                placeholder="请选择"
                                allowClear 
                                onChange={onIsStatusChange}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value={1}>正常</Select.Option>
                                <Select.Option value={0}>禁用</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6} className="max-w-full">
                        <Form.Item name="regType" label="注册类型">
                        <Select
                                placeholder="请选择"
                                allowClear 
                                onChange={onIsRegTypeChange}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value={0}>管理添加</Select.Option>
                                <Select.Option value={1}>手机</Select.Option>
                                <Select.Option value={2}>邮箱</Select.Option>
                                <Select.Option value={3}>账号密码</Select.Option>
                            </Select>
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
                                params.platform = undefined
                                params.memberName = undefined
                                params.mobile = undefined
                                params.email = undefined
                                params.isAgent = undefined
                                params.status = undefined
                                params.regType = undefined
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
                    title="添加会员" 
                    closable={false}
                    width={700}
                    visible={isAddModalVisible} 
                    footer={null}>
                    <MemberAdd 
                        handleOk={handleAddOk} 
                        handleCancel={() => setIsAddModalVisible(false)} />
                </Modal>
                : <></>
            }
            {
                isEditModalVisible
                    ? <Modal 
                        title="修改会员" 
                        closable={false}
                        width={700}
                        visible={isEditModalVisible} 
                        footer={null}>
                        <MemberEdit 
                            memberId={currentMemberId}
                            handleOk={handleEditOk} 
                            handleCancel={() => setIsEditModalVisible(false)} />
                    </Modal>
                    : <></>
            }
            {
                isEditVIPModalVisible
                    ? <Modal 
                        title="修改VIP" 
                        closable={false}
                        width={1000}
                        visible={isEditVIPModalVisible} 
                        footer={null}>
                        <MemberEditVIP 
                            memberId={currentMemberId}
                            vips={vips}
                            handleCancel={() => setIsEditVIPModalVisible(false)} />
                    </Modal>
                    : <></>
            }
        </>
    )
}

export default MemberList