import { 
    Button, 
    message, 
    Row,
    Col,
    List,
    Card,
    Popconfirm,
    Popover,
} from "antd"
import React, { useEffect, useState } from "react"
import { PlusOutlined } from '@ant-design/icons'
import { Vip } from "../../../types"
import MemberApi from "../../../api/MemberApi"
import dayjs from "dayjs"

type MemberEditProps = {
    memberId?: number,
    vips: Vip[],
    handleCancel: () => void
}

function MemberEditVIP({ memberId, vips, handleCancel }: MemberEditProps) {
    const [ list, setList ] = useState<Vip[]>([])
    const [ loading, setLoading ] = useState(false)
    const [ addVipVisible, setAddVipVisible ] = useState(false)
    
    const getVips = () => {
        setLoading(true)
        MemberApi.getValidVips({ memberId }).then(res => {
            setList(res.data.data)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }

    const del = ({ id }: { id?: number }) => {
        if (!id) return message.error('id不能为空！')
        MemberApi.deleteMemberVip({ id }).then(res => {
            message.success('成功删除')
            getVips()
        })
    }
    const addMemberVip = (vipId?: number) => {
        if (!memberId) return message.error('memberId不能为空！')
        if (!vipId) return message.error('vipId不能为空！')
        MemberApi.addMemberVip({ memberId, vipId }).then(res => {
            message.success('成功添加')
            setAddVipVisible(false)
            getVips()
        }).catch(() => {
            setAddVipVisible(false)
        })
    }

    useEffect(() => {
        getVips()
    }, [])

    return (
        <>
            <Row className="mb-4">
            <Popover
                placement="bottom"
                content={
                    <div>
                        {
                            vips.map((item: Vip) => (
                                <div 
                                    key={item.vipId}
                                    onClick={() => {
                                        addMemberVip(item.vipId)
                                        
                                    }}
                                    className="h-10 leading-10 text-blue-500 cursor-pointer">
                                    {item.validDays}天
                                </div>
                            ))
                        }
                    </div>
                }
                title="添加VIP"
                trigger="click"
                visible={addVipVisible}
                onVisibleChange={setAddVipVisible}>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined/>} >
                    添加VIP
                </Button>
            </Popover>
                
            </Row>
            <List
                loading={loading}
                grid={{ gutter: 16, column: 3 }}
                dataSource={list}
                renderItem={item => (
                <List.Item>
                    <Card 
                        title={
                            <div className="flex">
                                <div className="flex-1">{item.validDays + '天'}</div>
                                <div className="w-20 text-right">
                                    <Popconfirm
                                        title="确定要删除吗？"
                                        onConfirm={() => del(item)}
                                        onCancel={() => {
                                            message.info('已取消')
                                        }}
                                        okText="确定"
                                        cancelText="取消">
                                        <Button type="dashed" size="small">删除</Button>
                                    </Popconfirm>
                                    
                                </div>
                            </div>
                        } 
                        className="leading-normal">
                        <h1 className="flex">
                            <div className="w-20">开始时间：</div>
                            <div className="flex-1 font-bold text-blue-500">{item.startTime}</div>
                        </h1>
                        <h1 className="flex">
                            <div className="w-20">到期时间：</div>
                            <div className="flex-1 font-bold text-blue-500">
                                {dayjs(dayjs(item.startTime).valueOf() + item.validDays * 86400000).format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                        </h1>
                        <div className="flex">
                            <div className="w-20">价格：</div>
                            <div className="flex-1 font-bold text-yellow-600">{item.price}元</div>
                        </div>
                    </Card>
                </List.Item>
                )}
            />
            <Row>
                <Col span={24} className="text-right">
                    <Button className="mr-3" onClick={() => handleCancel()}>关闭</Button>
                </Col>
            </Row>
        </>
    )
}

export default MemberEditVIP