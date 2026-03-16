/**
 * 路由配置
 * 使用 React Router v6 模块化路由
 */

import { lazy, Suspense } from 'react'
import { Spin } from 'antd'
import { Outlet } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

// 懒加载页面组件
// 首页
const Home = lazy(() => import('@/pages/Home/Home'))

// 销售中心 - 订单管理
const OrderList = lazy(() => import('@/pages/Sales/Order/OrderList'))
const AfterSaleList = lazy(() => import('@/pages/Sales/AfterSale/AfterSaleList'))
// 销售中心 - 项目销售
const ProjectSaleList = lazy(() => import('@/pages/Sales/ProjectSale/ProjectSaleList'))
const ProjectSaleDetail = lazy(() => import('@/pages/Sales/ProjectSale/ProjectSaleDetail'))
const ProjectSaleAdd = lazy(() => import('@/pages/Sales/ProjectSale/ProjectSaleAdd'))

// 采购中心 - 采购管理
const PurchaseOrderList = lazy(() => import('@/pages/Purchase/PurchaseOrder/PurchaseOrderList'))
const PurchaseReturnList = lazy(() => import('@/pages/Purchase/PurchaseReturn/PurchaseReturnList'))

// 404 页面
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'))

// 加载中的占位组件
const PageLoading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '200px',
    width: '100%' 
  }}>
    <Spin size="large" />
  </div>
)

// 路由懒加载包装组件
const LazyWrapper: React.FC<{ component: React.LazyExoticComponent<React.FC> }> = ({ component: Component }) => (
  <Suspense fallback={<PageLoading />}>
    <Component />
  </Suspense>
)

/**
 * 路由配置
 */
export const routes: RouteObject[] = [
  // ==================== 首页 ====================
  {
    path: '/',
    element: <LazyWrapper component={Home} />,
  },

  // ==================== 销售中心 ====================
  {
    path: '/sales',
    element: <Outlet />,
    children: [
      {
        path: 'order',
        element: <Outlet />,
        children: [
          {
            path: 'list',
            element: <LazyWrapper component={OrderList} />,
          },
        ],
      },
      {
        path: 'after-sale',
        element: <Outlet />,
        children: [
          {
            path: 'list',
            element: <LazyWrapper component={AfterSaleList} />,
          },
        ],
      },
      {
        path: 'project-sale',
        element: <Outlet />,
        children: [
          {
            path: 'list',
            element: <LazyWrapper component={ProjectSaleList} />,
          },
          {
            path: 'add',
            element: <LazyWrapper component={ProjectSaleAdd} />,
          },
          {
            path: 'detail/:id',
            element: <LazyWrapper component={ProjectSaleDetail} />,
          },
        ],
      },
    ],
  },

  // ==================== 采购中心 ====================
  {
    path: '/purchase',
    element: <Outlet />,
    children: [
      {
        path: 'order',
        element: <Outlet />,
        children: [
          {
            path: 'list',
            element: <LazyWrapper component={PurchaseOrderList} />,
          },
        ],
      },
      {
        path: 'return',
        element: <Outlet />,
        children: [
          {
            path: 'list',
            element: <LazyWrapper component={PurchaseReturnList} />,
          },
        ],
      },
    ],
  },

  // ==================== 404 ====================
  {
    path: '*',
    element: <LazyWrapper component={NotFound} />,
  },
]

export default routes
