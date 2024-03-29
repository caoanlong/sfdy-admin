import { 
    Table, 
    Tag, 
    Form, 
    Row, 
    Col, 
    Button, 
    Input, 
    Select, 
    Space, 
    Popconfirm, 
    Modal,
    message 
} from "antd"
import React, { useEffect, useState } from "react"
import dayjs from 'dayjs'
import VodApi, { VodFindListParams } from "../../../api/VodApi"
import { Vod, VodType } from "../../../types"
import { useDispatch, useSelector } from "react-redux"
import { fetchTypes } from "../../../store/actions"
import { AppState } from "../../../store"
import { decodeUnicode } from "../../../utils/tools"
import VideoEdit from './VideoEdit'

const params: VodFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    vodName: undefined,
    typeId: undefined,
    vodClass: undefined
}

function VideoList() {

    const dispatch = useDispatch()
    const types: VodType[] = useSelector((state: AppState) => state.vod.types)
    const typesMap = useSelector((state: AppState) => state.vod.typesMap)
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<Vod[]>([])
    const [ total, setTotal ] = useState(0)
    const [ currentType, setCurrentType ] = useState<VodType>()
    const [ form ] = Form.useForm()
    const [ isEditModalVisible, setIsEditModalVisible ] = useState<boolean>(false)
    const [ currentVideoId, setCurrentVideoId ] = useState<number>()
    
    const getList = () => {
        setLoading(true)
        VodApi.findList(params).then(res => {
            setTotal(res.data.data.total)
            const rows = res.data.data.list.map((item: Vod) => ({
                key: item.vodId,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const onFinish = ({ vodName, typeId, vodClass }: any) => {
        params.vodName = vodName || undefined
        params.typeId = typeId || undefined
        params.vodClass = vodClass || undefined
        getList()
    }

    const onTypeChange = (value: number) => {
        const type = types.find(item => item.typeId === value)
        if (type && type.typeExtend) {
            const typeExtendJson = JSON.parse(decodeUnicode((type.typeExtend)))
            const classes = '全部,' + typeExtendJson?.class
            const classList = classes?.split(',')
            type.classList = classList
        }
        setCurrentType(type)
        form.setFieldsValue({ vodClass: '' })
    }

    const del = (item: Vod) => {
        VodApi.del({ vodId: item.vodId }).then(res => {
            message.success('成功删除:' + item.vodName)
            getList()
        })
    }
    const handleEdit = (videoId?: number) => {
        setCurrentVideoId(videoId)
        setIsEditModalVisible(true)
    }
    const handleEditOk = () => {
        setIsEditModalVisible(false)
        getList()
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
            width: 80
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
            width: 160
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
                <Tag 
                    color="#2db7f5" 
                    className="cursor-pointer" 
                    onClick={() => handleEdit(record?.vodId)}>
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
                <Row gutter={24} className="block md:flex">
                    <Col span={6} className="max-w-full">
                        <Form.Item name="vodName" label="名称">
                            <Input placeholder="请输入..."/>
                        </Form.Item>
                    </Col>
                    <Col span={6} className="max-w-full">
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
                    <Col span={6} className="max-w-full">
                        <Form.Item name="vodClass" label="分类">
                            <Select
                                placeholder="请选择"
                                allowClear>
                                {
                                    currentType?.classList?.map((item: string) => (
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
                <Row className="justify-end">
                    <Button type="primary" htmlType="submit">
                        搜索
                    </Button>
                    <Button
                        className="ml-2"
                        onClick={() => {
                            form.resetFields()
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
                    defaultCurrent: params.pageIndex,
                    showQuickJumper: true,
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
                        title="修改视频" 
                        closable={false}
                        width={900}
                        visible={isEditModalVisible} 
                        footer={null}>
                        <VideoEdit 
                            vodId={currentVideoId}
                            handleOk={handleEditOk} 
                            handleCancel={() => setIsEditModalVisible(false)} />
                    </Modal>
                    : <></>
            }
        </>
    )
}

export default VideoList