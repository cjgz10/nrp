/**
 * 主布局组件
 * 包含侧边栏、头部、内容区域、页签导航
 */

import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useAppStore } from '@/store'
import TabNav from './TabNav'

// 引入样式
import './MainLayout.less'

const { Header, Sider, Content } = Layout

// 菜单key到标题的映射
const keyToTitleMap: Record<string, string> = {
  '/sales/order/list': '订单列表',
  '/sales/after-sale/list': '售后列表',
  '/sales/project-sale/list': '项目列表',
  '/purchase/order/list': '采购单列表',
  '/purchase/return/list': '采退单列表',
}

/**
 * 主布局组件
 */
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { collapsed, toggleCollapsed, addTab, setActiveTab } = useAppStore()

  // 菜单配置
  const menuItems = useMemo(() => {
    const items: any[] = [
      // 销售中心
      {
        key: 'sales',
        icon: <ShopOutlined />,
        label: '销售中心',
        children: [
          {
            key: 'sales-order',
            icon: <FileTextOutlined />,
            label: '订单管理',
            children: [
              {
                key: '/sales/order/list',
                label: '订单列表',
              },
              {
                key: '/sales/after-sale/list',
                label: '售后列表',
              },
            ],
          },
          {
            key: 'sales-project',
            icon: <FileTextOutlined />,
            label: '项目销售',
            children: [
              {
                key: '/sales/project-sale/list',
                label: '项目列表',
              },
            ],
          },
        ],
      },
      // 采购中心
      {
        key: 'purchase',
        icon: <ShoppingCartOutlined />,
        label: '采购中心',
        children: [
          {
            key: 'purchase-manage',
            icon: <FileTextOutlined />,
            label: '采购管理',
            children: [
              {
                key: '/purchase/order/list',
                label: '采购单列表',
              },
              {
                key: '/purchase/return/list',
                label: '采退单列表',
              },
            ],
          },
        ],
      },
    ]
    return items
  }, [])

  // 获取当前选中的菜单项
  const selectedKeys = useMemo(() => {
    const path = location.pathname
    return [path]
  }, [location.pathname])

  // 获取展开的菜单项
  const openKeys = useMemo(() => {
    const path = location.pathname
    const keys: string[] = []
    
    if (path.startsWith('/sales')) {
      keys.push('sales')
      if (path.includes('/order/')) {
        keys.push('sales-order')
      } else if (path.includes('/project')) {
        keys.push('sales-project')
      }
    } else if (path.startsWith('/purchase')) {
      keys.push('purchase', 'purchase-manage')
    }
    
    return keys
  }, [location.pathname])

  // 菜单点击事件
  const handleMenuClick = (info: { key: string }) => {
    const title = keyToTitleMap[info.key] || '未命名'
    // 添加页签并切换
    addTab({
      key: info.key,
      title,
      closable: true,
    })
    setActiveTab(info.key)
    navigate(info.key)
  }

  return (
    <Layout className="main-layout">
      {/* 侧边栏 */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="layout-sider"
        width={220}
        collapsedWidth={80}
        style={{ backgroundColor: '#fff' }}
      >
        {/* Logo 区域 */}
        <div className="logo-container">
          {collapsed ? (
            <div className="logo-icon">N</div>
          ) : (
            <div className="logo-text">NRP 后台</div>
          )}
        </div>

        {/* 菜单 */}
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys}
          items={menuItems}
          onClick={handleMenuClick}
          className="layout-menu"
          style={{ 
            borderRight: 0,
            backgroundColor: '#fff',
          }}
        />
        
        {/* 左下角功能按钮 */}
        <div className="sider-footer">
          <div className="sider-actions">
            <Button type="text" icon={<BellOutlined />} className="sider-action-btn" title="通知" />
            <Button type="text" icon={<SettingOutlined />} className="sider-action-btn" title="设置" />
            <Button type="text" icon={<UserOutlined />} className="sider-action-btn" title="个人中心" />
          </div>
        </div>
      </Sider>

      {/* 右侧布局 */}
      <Layout>
        {/* 头部 */}
        <Header className="layout-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              className="trigger-button"
            />
            {/* 页签导航 */}
            <TabNav />
          </div>
        </Header>

        {/* 内容区域 */}
        <Content className="layout-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
