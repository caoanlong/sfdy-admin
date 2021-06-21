import { Switch, Route, Link, useHistory } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown } from 'antd'
import {
	MenuUnfoldOutlined,
  	MenuFoldOutlined,
	DesktopOutlined,
	PieChartOutlined,
	FileOutlined,
	TeamOutlined,
	UserOutlined,
	HomeFilled
  } from '@ant-design/icons'
import Index from './Index'
import About from './About'
import { useEffect, useState } from 'react'
import { fetchUserInfo, setToken, setUserInfo } from '../store/actions'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../store'
import { User } from '../types'

const { Header, Footer, Sider, Content } = Layout
const { SubMenu } = Menu

function Base() {

	const [ collapsed, setCollapsed ] = useState(false)
	const userInfo: User = useSelector((state: AppState) => state.user.userInfo)
	const dispatch = useDispatch()
	const history = useHistory()

	useEffect(() => {
		dispatch(fetchUserInfo())
	}, [])

	const logout = () => {
		dispatch(setToken(''))
		dispatch(setUserInfo({}))
		history.push('/login')
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
						defaultSelectedKeys={['1']} 
						mode="inline">
						<Menu.Item 
							key="/" 
							icon={<HomeFilled />}>
							首页
						</Menu.Item>
						<SubMenu 
							key="/video" 
							icon={<TeamOutlined />} 
							title="视频">
							<Menu.Item key="/video/list">视频列表</Menu.Item>
							<Menu.Item key="/video/collect">视频采集</Menu.Item>
							<Menu.Item key="/video/scan">视频扫描删除</Menu.Item>
						</SubMenu>
						<Menu.Item 
							key="/banner" 
							icon={<DesktopOutlined />}>
							Banner
						</Menu.Item>
						<Menu.Item 
							key="/seo" 
							icon={<DesktopOutlined />}>
							SEO
						</Menu.Item>
						<Menu.Item 
							key="/link" 
							icon={<DesktopOutlined />}>
							友链
						</Menu.Item>
						<Menu.Item 
							key="/script" 
							icon={<DesktopOutlined />}>
							脚本代码
						</Menu.Item>
						<SubMenu 
							key="/system" 
							icon={<TeamOutlined />} 
							title="系统">
							<Menu.Item key="/system/user">用户</Menu.Item>
							<Menu.Item key="/system/role">角色</Menu.Item>
							<Menu.Item key="/system/permission">权限</Menu.Item>
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
							<Route path="/about">
								<About/>
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