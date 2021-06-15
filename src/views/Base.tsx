import { Switch, Route, Link } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
	DesktopOutlined,
	PieChartOutlined,
	FileOutlined,
	TeamOutlined,
	UserOutlined,
	HomeFilled
  } from '@ant-design/icons'
import Index from './Index'
import About from './About'

const { Header, Footer, Sider, Content } = Layout
const { SubMenu } = Menu

function Base() {
    return (
        <div>
			<Layout className="layout">
				<Sider>
					<img className="layout-logo" src="/images/logo.svg" alt="巨硬AV" />
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
					<Header>Header</Header>
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
					<Footer>Footer</Footer>
				</Layout>
			</Layout>
            
        </div>
    )
}

export default Base