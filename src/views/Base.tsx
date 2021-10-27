import { Switch, Route, useHistory, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown } from 'antd'
import {
	MenuUnfoldOutlined,
  	MenuFoldOutlined,
	UserOutlined,
	HomeFilled,
	SettingFilled,
	PlaySquareFilled,
	PictureFilled,
	CodeFilled,
	GoogleSquareFilled,
	ApiFilled,
	AppstoreFilled,
	SmileFilled,
	HeartFilled
  } from '@ant-design/icons'
import Index from './Index'
import React, { useEffect, useState } from 'react'
import { fetchUserInfo, setToken, setUserInfo } from '../store/actions'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../store'
import { User } from '../types'
import VideoList from './video/VideoList'
import VideoTypes from './video/VideoTypes'
import VideoCollect from './video/VideoCollect'
import VideoScan from './video/VideoScan'
import BannerList from './banner'
import Seo from './seo'
import FriendLinkList from './friendLink'
import Notice from './notice'
import SysUser from './system/SysUser'
import SysRole from './system/SysRole'
import MemberList from './member/MemberList'
import VipList from './member/VipList'
import OrderList from './member/OrderList'
import AppVersion from './AppVersion'
import Tags from './tag'
import Moneys from './money'
import Cities from './city'
import Posts from './post'
import Provinces from './province'
import PostAdd from './post/PostAdd'
import PostEdit from './post/PostEdit'

const { Header, Footer, Sider, Content } = Layout
const { SubMenu } = Menu

function Base() {
	const c = localStorage.getItem('collapsed')
	const [ collapsed, setCollapsed ] = useState(c && c === 'true' ? true : false)
	const userInfo: User = useSelector((state: AppState) => state.user.userInfo)
	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()

	const logout = () => {
		dispatch(setToken(''))
		dispatch(setUserInfo({}))
		history.push('/login')
	}

	const handleClick = (e: any) => {
		history.push(e.key)
	}

	useEffect(() => {
		dispatch(fetchUserInfo())
	}, [])

	useEffect(() => {
		localStorage.setItem('collapsed', String(collapsed))
	}, [collapsed])

    return (
        <div>
			<Layout className="min-h-screen">
				<Sider trigger={null} collapsible collapsed={collapsed}>
					<img 
						className="block h-9 my-1 mx-auto"
						src={`/images/${collapsed ? 'logo_mini.svg' : 'logo.svg'}`} alt="巨硬AV" />
					<Menu 
						theme="dark" 
						selectedKeys={[location.pathname]} 
						mode="inline" 
						onClick={handleClick}>
						<Menu.Item 
							key="/" 
							icon={<HomeFilled />}>
							首页
						</Menu.Item>
						<SubMenu 
							key="/member" 
							icon={<SmileFilled />} 
							title="用户">
							<Menu.Item key="/member/list">用户列表</Menu.Item>
							<Menu.Item key="/member/order">用户订单</Menu.Item>
						</SubMenu>
						<SubMenu 
							key="/sezhan" 
							icon={<PlaySquareFilled />} 
							title="色站">
							<Menu.Item key="/sezhan/videolist">视频列表</Menu.Item>
							<Menu.Item key="/sezhan/videotypes">视频分类</Menu.Item>
							<Menu.Item key="/sezhan/videoscan">视频扫描</Menu.Item>
							<Menu.Item key="/sezhan/videocollect">视频采集</Menu.Item>
							<Menu.Item key="/sezhan/vip">VIP列表</Menu.Item>
						</SubMenu>
						<SubMenu 
							key="/fenglou" 
							icon={<HeartFilled />} 
							title="凤楼">
							<Menu.Item key="/fenglou/posts">资讯列表</Menu.Item>
							<Menu.Item key="/fenglou/cities">城市列表</Menu.Item>
							<Menu.Item key="/fenglou/provinces">省份列表</Menu.Item>
							<Menu.Item key="/fenglou/tags">标签列表</Menu.Item>
							<Menu.Item key="/fenglou/moneys">充值面额</Menu.Item>
						</SubMenu>
						<Menu.Item 
							key="/banner" 
							icon={<PictureFilled />}>
							Banner
						</Menu.Item>
						<Menu.Item 
							key="/notice" 
							icon={<CodeFilled />}>
							公告
						</Menu.Item>
						<Menu.Item 
							key="/link" 
							icon={<ApiFilled />}>
							友链
						</Menu.Item>
						<Menu.Item 
							key="/seo" 
							icon={<GoogleSquareFilled />}>
							SEO
						</Menu.Item>
						<Menu.Item 
							key="/appversion" 
							icon={<AppstoreFilled />}>
							APP版本
						</Menu.Item>
						<SubMenu 
							key="/system" 
							icon={<SettingFilled />} 
							title="系统">
							<Menu.Item key="/system/user">用户</Menu.Item>
							<Menu.Item key="/system/role">角色</Menu.Item>
						</SubMenu>
					</Menu>
				</Sider>
				<Layout>
					<Header className="bg-white shadow h-12 px-0 flex relative z-20">
						<div 
							className="w-12 flex justify-center items-center cursor-pointer" 
							onClick={() => setCollapsed(!collapsed)}>
							{
								collapsed 
									? <MenuUnfoldOutlined className="text-lg"/> 
									: <MenuFoldOutlined className="text-lg"/>
							}
							
						</div>
						
						<div className="flex-1 flex justify-end px-3">
							<Dropdown overlay={
								<Menu>
									<Menu.Item key="1">个人资料</Menu.Item>
									<Menu.Item key="2" onClick={logout}>退出登录</Menu.Item>
								</Menu>
							}>
								<div className="flex cursor-pointer">
									<div className="flex justify-center items-center w-12">
										<Avatar icon={<UserOutlined />} />
									</div>
									<div className="px-1 flex justify-center items-center">
										{userInfo.adminName}
									</div>
								</div>
							</Dropdown>
						</div>
					</Header>
					<Content>
						<Switch>
							<Route path="/member/list">
								<MemberList/>
							</Route>
							<Route path="/member/order">
								<OrderList/>
							</Route>
							<Route path="/sezhan/vip">
								<VipList/>
							</Route>
							<Route path="/sezhan/videolist">
								<VideoList/>
							</Route>
							<Route path="/sezhan/videotypes">
								<VideoTypes/>
							</Route>
							<Route path="/sezhan/videocollect">
								<VideoCollect/>
							</Route>
							<Route path="/sezhan/videoscan">
								<VideoScan/>
							</Route>
							<Route exact path="/fenglou/posts">
								<Posts/>
							</Route>
							<Route path="/fenglou/posts/add">
								<PostAdd />
							</Route>
							<Route path="/fenglou/posts/edit">
								<PostEdit />
							</Route>
							<Route exact path="/fenglou/cities">
								<Cities/>
							</Route>
							<Route exact path="/fenglou/provinces">
								<Provinces/>
							</Route>
							<Route exact path="/fenglou/tags">
								<Tags/>
							</Route>
							<Route exact path="/fenglou/moneys">
								<Moneys/>
							</Route>
							<Route path="/banner">
								<BannerList/>
							</Route>
							<Route path="/seo">
								<Seo/>
							</Route>
							<Route path="/link">
								<FriendLinkList/>
							</Route>
							<Route path="/notice">
								<Notice/>
							</Route>
							<Route path="/appversion">
								<AppVersion/>
							</Route>
							<Route path="/system/user">
								<SysUser/>
							</Route>
							<Route path="/system/role">
								<SysRole/>
							</Route>
							<Route path="/" exact>
								<Index/>
							</Route>
						</Switch>
					</Content>
					<Footer className="text-center">Ant Design ©2021 Created by Aaron</Footer>
				</Layout>
			</Layout>
            
        </div>
    )
}

export default Base