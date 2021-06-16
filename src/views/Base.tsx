import { Switch, Route, Link } from 'react-router-dom'
import { Layout, Menu, Avatar } from 'antd'
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
import { useState } from 'react'

const { Header, Footer, Sider, Content } = Layout
const { SubMenu } = Menu

function Base() {

	const [ collapsed, setCollapsed ] = useState(false)

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
							key="1" 
							icon={<HomeFilled />}>
							首页
						</Menu.Item>
						<SubMenu 
							key="2" 
							icon={<TeamOutlined />} 
							title="视频">
							<Menu.Item key="2-1">视频列表</Menu.Item>
							<Menu.Item key="2-2">视频扫描删除</Menu.Item>
						</SubMenu>
						<Menu.Item 
							key="3" 
							icon={<DesktopOutlined />}>
							Banner
						</Menu.Item>
						<Menu.Item 
							key="4" 
							icon={<DesktopOutlined />}>
							SEO
						</Menu.Item>
						<Menu.Item 
							key="5" 
							icon={<DesktopOutlined />}>
							友链
						</Menu.Item>
						<Menu.Item 
							key="6" 
							icon={<DesktopOutlined />}>
							脚本代码
						</Menu.Item>
						<SubMenu 
							key="7" 
							icon={<TeamOutlined />} 
							title="系统">
							<Menu.Item key="7-1">用户</Menu.Item>
							<Menu.Item key="7-2">角色</Menu.Item>
							<Menu.Item key="7-3">权限</Menu.Item>
						</SubMenu>
					</Menu>
				</Sider>
				<Layout>
					<Header className="bg-white shadow h-12 px-0 flex">
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
							<div className="flex justify-center items-center w-12">
								<Avatar icon={<UserOutlined />} />
							</div>
						</div>
					</Header>
					<Content>
						<Switch>
							<Route path="/about">
								<About/>
							</Route>
							<Route path="/">
								<Index/>
							</Route>
						</Switch>
					</Content>
					<Footer className="text-center">Ant Design ©2018 Created by Ant UED</Footer>
				</Layout>
			</Layout>
            
        </div>
    )
}

export default Base