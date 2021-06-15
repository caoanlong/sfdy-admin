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
						<Menu.Item 
							key="2" 
							icon={<DesktopOutlined />}>
							Option 2
						</Menu.Item>
						<SubMenu 
							key="sub1" 
							icon={<UserOutlined />} 
							title="用户">
							<Menu.Item key="3">Tom</Menu.Item>
							<Menu.Item key="4">Bill</Menu.Item>
							<Menu.Item key="5">Alex</Menu.Item>
						</SubMenu>
						<SubMenu 
							key="sub2" 
							icon={<TeamOutlined />} 
							title="系统">
							<Menu.Item key="6">Team 1</Menu.Item>
							<Menu.Item key="8">Team 2</Menu.Item>
						</SubMenu>
						<Menu.Item key="9" icon={<FileOutlined />}>
							文件
						</Menu.Item>
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