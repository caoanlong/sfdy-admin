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
	AppstoreFilled
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
import BannerList from './banner/BannerList'
import SEO from './SEO'
import FriendLinkList from './friendLink/FriendLinkList'
import ScriptCode from './ScriptCode'
import SysUser from './system/SysUser'
import SysRole from './system/SysRole'

const { Header, Footer, Sider, Content } = Layout
const { SubMenu } = Menu

function Base() {

	const [ collapsed, setCollapsed ] = useState(false)
	const userInfo: User = useSelector((state: AppState) => state.user.userInfo)
	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()

	useEffect(() => {
		dispatch(fetchUserInfo())
	}, [])

	const logout = () => {
		dispatch(setToken(''))
		dispatch(setUserInfo({}))
		history.push('/login')
	}

	const handleClick = (e: any) => {
		history.push(e.key)
	}

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
							key="/video" 
							icon={<PlaySquareFilled />} 
							title="视频">
							<Menu.Item key="/video/list">视频列表</Menu.Item>
							<Menu.Item key="/video/types">视频分类</Menu.Item>
							<Menu.Item key="/video/collect">视频采集</Menu.Item>
							<Menu.Item key="/video/scan">视频扫描删除</Menu.Item>
						</SubMenu>
						<Menu.Item 
							key="/banner" 
							icon={<PictureFilled />}>
							Banner
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
							key="/scriptcode" 
							icon={<CodeFilled />}>
							脚本代码
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
							<Route path="/video/list">
								<VideoList/>
							</Route>
							<Route path="/video/types">
								<VideoTypes/>
							</Route>
							<Route path="/video/collect">
								<VideoCollect/>
							</Route>
							<Route path="/video/scan">
								<VideoScan/>
							</Route>
							<Route path="/banner">
								<BannerList/>
							</Route>
							<Route path="/seo">
								<SEO/>
							</Route>
							<Route path="/link">
								<FriendLinkList/>
							</Route>
							<Route path="/scriptcode">
								<ScriptCode/>
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