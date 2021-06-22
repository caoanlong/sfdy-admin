import { Table, Tag, Form, Row, Col, Button, Input, Select, Space, Popconfirm, message } from "antd"
import { useEffect, useState } from "react"
import dayjs from 'dayjs'
import VodApi from "../../api/VodApi"
import { Vod, VodType } from "../../types"
import VodTypeApi from "../../api/VodTypeApi"
import { useDispatch, useSelector } from "react-redux"
import { fetchTypes } from "../../store/actions"
import { AppState } from "../../store"
import { decodeUnicode } from "../../utils/tools"

function VideoList() {

    const dispatch = useDispatch()
    const types: VodType[] = useSelector((state: AppState) => state.vod.types)
    const typesMap = useSelector((state: AppState) => state.vod.typesMap)
    const [ list, setList ] = useState<Vod[]>([])
    const [ total, setTotal ] = useState(0)
    const [ currentType, setCurrentType ] = useState<VodType>()
    let pageIndex = 1, pageSize = 10
    const [ form ] = Form.useForm()

    const getList = () => {
        VodApi.findList().then(res => {
            const rows = res.data.data.list.map((item: Vod) => ({
                key: item.vodId,
                ...item
            }))
            setList(rows)
            setTotal(res.data.data.total)
        })
    }

    const onFinish = (values: any) => {
        getList()
    }

    const onTypeChange = (value: number) => {
        const type = types.find(item => item.typeId === value)
        if (type) {
            const typeExtendJson = JSON.parse(decodeUnicode((type.typeExtend as string)))
            const classes = '全部' + ',' + typeExtendJson?.class
            const classList = classes?.split(',')
            type.classList = classList
        }
        setCurrentType(type)
        form.setFieldsValue({ vodClass: '' })
    }

    const del = (item: Vod) => {
        console.log(item)
        message.success('成功删除:' + item.vodName)
    }

    useEffect(() => {
        dispatch(fetchTypes())
        getList()
    }, [])

    const columns = [
        {
            title: '编号',
            dataIndex: 'vodId',
            key: 'vodId',
            width: 90
        },{
            title: '名称',
            dataIndex: 'vodName',
            key: 'vodName',
            ellipsis: true
        },{
            title: '类型',
            dataIndex: 'typeId',
            key: 'typeId',
            width: 110,
            render: (typeId: number) => typesMap[typeId]
        },{
            title: '分类',
            dataIndex: 'vodClass',
            key: 'vodClass',
            width: 110
        },{
            title: '人气',
            dataIndex: 'vodHits',
            key: 'vodHits',
            width: 80
        },{
            title: '评分',
            dataIndex: 'vodScore',
            key: 'vodScore',
            width: 70
        },{
            title: '播放器',
            dataIndex: 'vodPlayFrom',
            key: 'vodPlayFrom',
            width: 90
        },{
            title: '更新时间',
            dataIndex: 'vodTime',
            key: 'vodTime',
            width: 180,
            render: (time: number) => {
                return (<span>{dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>)
            }
        },{
            title: '操作',
            key: 'action',
            width: 140,
            render: (text: any, record: Vod) => (
              <Space size="middle">
                <Tag color="#2db7f5" className="cursor-pointer">编辑</Tag>
                <Popconfirm
                    title="确定要删除吗？"
                    onConfirm={() => del(record)}
                    onCancel={() => {
                        message.info('已取消')
                    }}
                    okText="确定"
                    cancelText="取消">
                    <Tag color="#f50" className="cursor-pointer">删除</Tag>
                </Popconfirm>,
              </Space>
            ),
        }
    ]

    return (
        <div>
            <Form
                name="advanced_search"
                className="bg-white m-4 p-3 shadow"
                form={form}
                onFinish={onFinish}>
                <Row gutter={24}>
                    <Col span={6} key="vodName">
                        <Form.Item name="vodName" label="名称">
                            <Input placeholder="请输入..."/>
                        </Form.Item>
                    </Col>
                    <Col span={6} key="typeId">
                        <Form.Item name="typeId" label="类型">
                            <Select
                                placeholder="请选择"
                                allowClear 
                                onChange={onTypeChange}>
                                <Select.Option value="">全部</Select.Option>
                                {
                                    types.map((type: VodType) => (
                                        <Select.Option 
                                            key={type.typeId} 
                                            value={type.typeId}>
                                            { type.typeName }
                                        </Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6} key="vodClass">
                        <Form.Item name="vodClass" label="分类">
                            <Select
                                placeholder="请选择"
                                allowClear>
                                {
                                    currentType?.classList.map((item: string) => (
                                        <Select.Option 
                                            key={item} 
                                            value={item}>
                                            { item }
                                        </Select.Option>
                                    ))
                                }
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

export default VideoList