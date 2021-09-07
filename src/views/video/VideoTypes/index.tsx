import { 
    Table, 
    Tag, 
    Space, 
    Popconfirm, 
    message, 
    Modal
} from "antd"
import React, { useEffect, useState } from "react"
import { VodType } from "../../../types"
import VodTypeApi from "../../../api/VodTypeApi"
import VideoTypeEdit from "./VideoTypeEdit"
import VideoTypePermission from "./VideoTypePermission"

function VideoTypes() {

    const [ loading, setLoading ] = useState(false)
    const [ list, setList ] = useState<VodType[]>([])

    const [ isEditModalVisible, setIsEditModalVisible ] = useState(false)
    const [ isPermissionModalVisible, setIsPermissionModalVisible ] = useState(false)
    const [ currentTypeId, setCurrentTypeId ] = useState<number>()
    
    const getList = () => {
        setLoading(true)
        VodTypeApi.findAll().then(res => {
            const rows = res.data.data.map((item: VodType) => ({
                key: item.typeId,
                ...item
            }))
            setList(rows)
            setLoading(false)
        })
    }

    const del = (item: VodType) => {
        VodTypeApi.del({ typeId: item.typeId }).then(res => {
            message.success('成功删除:' + item.typeName)
            getList()
        })
    }

    const handleEdit = (typeId: number) => {
        setCurrentTypeId(typeId)
        setIsEditModalVisible(true)
    }

    const handlePermission = (typeId: number) => {
        setCurrentTypeId(typeId)
        setIsPermissionModalVisible(true)
    }

    const handleEditOk = () => {
        setIsEditModalVisible(false)
        getList()
    }
    const handlePermissionOk = () => {
        setIsPermissionModalVisible(false)
        getList()
    }

    useEffect(() => {
        getList()
    }, [])

    const columns = [
        {
            title: '编号',
            dataIndex: 'typeId',
            key: 'typeId',
            width: 70
        },{
            title: '名称',
            dataIndex: 'typeName',
            key: 'typeName',
            ellipsis: true
        },{
            title: '英文名',
            dataIndex: 'typeEn',
            key: 'typeEn'
        },{
            title: '状态',
            dataIndex: 'typeStatus',
            key: 'typeStatus',
            render: (status: number) => status === 1 ? <Tag color="green">正常</Tag> : <Tag>关闭</Tag>
        },{
            title: '排序',
            dataIndex: 'typeSort',
            key: 'typeSort'
        },{
            title: '操作',
            key: 'action',
            width: 240,
            render: (text: any, record: VodType) => (
              <Space size="middle">
                <Tag 
                    color="#2db7f5" 
                    className="cursor-pointer" 
                    onClick={() => handleEdit(record.typeId)}>
                    编辑
                </Tag>
                <Tag 
                    color="#2db7f5" 
                    className="cursor-pointer" 
                    onClick={() => handlePermission(record.typeId)}>
                    视频权限
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
            <Table 
                className="bg-white m-4 p-3 shadow" 
                columns={columns} 
                dataSource={list} 
                loading={loading}
                bordered>
            </Table>
            {
                isEditModalVisible && currentTypeId
                    ? <Modal 
                        title="修改类型" 
                        closable={false}
                        width={700}
                        visible={isEditModalVisible} 
                        footer={null}>
                        <VideoTypeEdit 
                            typeId={currentTypeId}
                            handleOk={handleEditOk} 
                            handleCancel={() => setIsEditModalVisible(false)} />
                    </Modal>
                    : <></>
            }
            {
                isPermissionModalVisible && currentTypeId
                    ? <Modal 
                        title="修改权限" 
                        closable={false}
                        width={700}
                        visible={isPermissionModalVisible} 
                        footer={null}>
                        <VideoTypePermission
                            typeId={currentTypeId}
                            handleOk={handlePermissionOk} 
                            handleCancel={() => setIsPermissionModalVisible(false)} />
                    </Modal>
                    : <></>
            }
        </>
    )
}

export default VideoTypes