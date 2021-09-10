import { 
    Table, 
    Tag, 
    Button, 
    Space, 
    Popconfirm, 
    message 
} from "antd"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import VodApi, { VodFindListParams } from "../../api/VodApi"
import { AppState } from "../../store"
import { Vod } from "../../types"

const params: VodFindListParams = {
    pageIndex: 1,
    pageSize: 10,
    status: 0
}

function VideoScan() {
    const typesMap = useSelector((state: AppState) => state.vod.typesMap)
    const [ delLoading, setDelLoading ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<Vod[]>([])
    const [ total, setTotal ] = useState(0)

    const getList = () => {
        setLoading(true)
        VodApi.findList(params).then(res => {
            setTotal(res.data.data.total)
            const rows = res.data.data.list.map((item: Vod) => ({
                key: item.vodId,
                loading: false,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const del = (item: Vod) => {
        VodApi.del({ vodId: item.vodId }).then(res => {
            message.success('成功删除:' + item.vodName)
            getList()
        })
    }
    const delUnPlay = () => {
        setDelLoading(true)
        VodApi.delUnPlay().then(res => {
            message.success('成功删除全部不能播放的视频！')
            getList()
        }).finally(() => {
            setDelLoading(false)
        })
    }

    const hanleTest = (item: Vod) => {
        item.loading = true
        setList([...list])
        const arr = item.vodPlayUrl.split('http')
        const URL = "http" + arr[arr.length - 1]
        fetch(URL, { mode: 'cors' }).then(res => {
            if (res.status === 200) {
                item.status = 1
            }
            item.loading = false
            setList([...list])
        }).catch(err => {
            item.loading = false
            setList([...list])
        })
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
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status: number) => {
                if (status === 1) {
                    return <Tag color="#87d068">正常</Tag>
                } else {
                    return <Tag color="#f50">失败</Tag>
                }
            }
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
            width: 180,
            render: (text: any, record: Vod) => (
              <Space size="middle">
                <Button 
                    type="primary" 
                    size="small" 
                    loading={record.loading}
                    onClick={() => hanleTest(record)}>
                    {record.loading ? '...' : '重试'}
                </Button>
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
            <div className="bg-white m-4 p-3 shadow">
                <h1 className="text-xl text-red-600 inline-block">共：{total}条</h1>
                <Button 
                    loading={delLoading} 
                    className="ml-4" 
                    type="primary" 
                    onClick={delUnPlay}>
                    一键删除所有
                </Button>
            </div>
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

export default VideoScan