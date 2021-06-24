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
    Modal,
    message 
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import { RefObject, useEffect, useRef, useState } from "react"
import dayjs from 'dayjs'
import BannerApi, { BannerFindListParams } from "../../api/BannerApi"
import { Banner } from "../../types"
import BannerAdd from "./BannerAdd"

export const BANNER_TYPES: { [key: string]: string} = {
    '1': '全部',
    '2': 'H5',
    '3': 'APP'
}


const params: BannerFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    bannerName: undefined
}
function BannerList() {
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<Banner[]>([])
    const [ total, setTotal ] = useState(0)
    const [ form ] = Form.useForm()
    const [ isAddModalVisible, setIsAddModalVisible ] = useState(false)
    
    const getList = () => {
        setLoading(true)
        BannerApi.findList(params).then(res => {
            setTotal(res.data.data.total)
            const rows = res.data.data.list.map((item: Banner) => ({
                key: item.bannerId,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const onFinish = ({ bannerName }: any) => {
        params.bannerName = bannerName || undefined
        getList()
    }

    const del = (item: Banner) => {
        BannerApi.del({ bannerId: item.bannerId }).then(res => {
            message.success('成功删除:' + item.bannerName)
            getList()
        })
    }
    const handleAddOk = () => {
        setIsAddModalVisible(false)
    }

    useEffect(() => {
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
            render: (text: any, record: Banner) => (
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
                    <Col span={6} key="bannerName">
                        <Form.Item name="bannerName" label="名称">
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
            <Modal 
                title="添加Banner" 
                width={700}
                visible={isAddModalVisible} 
                footer={null}>
                <BannerAdd 
                    handleOk={handleAddOk} 
                    handleCancel={() => setIsAddModalVisible(false)} />
            </Modal>
        </>
    )
}

export default BannerList