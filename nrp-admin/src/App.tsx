/**
 * App 入口组件
 * 配置路由和全局布局
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import zhCN from 'antd/locale/zh_CN'
import { ConfigProvider } from 'antd'
import MainLayout from '@/components/Layout/MainLayout'
import routes from '@/router/routes'
import type { RouteObject } from 'react-router-dom'

// Ant Design 主题配置 - Orange Theme
const themeConfig = {
  locale: zhCN,
  token: {
    // 主色调 - 橙色
    colorPrimary: '#FF6900',
    // 圆角
    borderRadius: 4,
    // 成功色
    colorSuccess: '#52c41a',
    // 警告色
    colorWarning: '#faad14',
    // 错误色
    colorError: '#f5222d',
    // 信息色
    colorInfo: '#FF6900',
  },
  components: {
    Menu: {
      // 菜单主题色
      itemSelectedBg: 'rgba(255, 105, 0, 0.1)',
      itemSelectedColor: '#FF6900',
      itemHoverColor: '#FF6900',
      itemHoverBg: 'rgba(255, 105, 0, 0.05)',
    },
    Button: {
      // 按钮主题色
      primaryColor: '#FF6900',
    },
  },
}

/**
 * 递归渲染路由
 */
const renderRoutes = (routeList: RouteObject[]) => {
  return routeList.map((route, index) => (
    <Route 
      key={route.path || index} 
      path={route.path}
      element={route.element}
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ))
}

/**
 * App 入口组件
 */
const App: React.FC = () => {
  return (
    <ConfigProvider theme={themeConfig}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            {/* 渲染所有路由 */}
            {renderRoutes(routes)}
            {/* 默认跳转到订单列表 */}
            <Route path="/" element={<Navigate to="/sales/order/list" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
