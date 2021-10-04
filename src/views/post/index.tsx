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
    message 
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from "react"
import dayjs from 'dayjs'
import { Post } from '../../types'
import PostApi, { PostFindListParams } from "../../api/PostApi"
import { useHistory } from "react-router"

const params: PostFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    title: undefined
}

function Posts() {
    const history = useHistory()
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<Post[]>([])
    const [ total, setTotal ] = useState(0)
    const [ form ] = Form.useForm()

    const getList = () => {
        setLoading(true)
        PostApi.findList(params).then(res => {
            setTotal(res.data.data.total)
            const rows = res.data.data.list.map((item: Post) => ({
                key: item.id,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const onFinish = ({ title }: any) => {
        params.title = title || undefined
        getList()
    }

    const del = (item: Post) => {
        if (!item.id) {
            message.error('id不能为空！')
            return
        }
        PostApi.del({ id: item.id }).then(res => {
            message.success('成功删除:' + item.title)
            getList()
        })
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
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true
        },{
            title: '城市',
            dataIndex: 'cityName',
            key: 'cityName',
            width: 180,
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 180,
            render: (time: number) => {
                return (<span>{time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : ''}</span>)
            }
        },{
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 180,
            render: (time: number) => {
                return (<span>{time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : ''}</span>)
            }
        },{
            title: '操作',
            key: 'action',
            width: 140,
            render: (text: any, record: Post) => (
              <Space size="middle">
                <Tag 
                    color="#2db7f5" 
                    className="cursor-pointer"
                    onClick={() => {
                        history.push(`/fenglou/posts/edit?id=${record.id}`)
                    }}>
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
                    <Col span={6} key="linkName">
                        <Form.Item name="linkName" label="名称">
                            <Input placeholder="请输入..."/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Button 
                            type="primary"
                            icon={<PlusOutlined/>} 
                            onClick={() => history.push('/fenglou/posts/add')}>
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
                                params.title = undefined
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

export default Posts