/**
 * 菜单配置
 * 定义三级菜单结构
 * 销售中心 —— 订单管理 —— 订单列表、售后列表
 * 采购中心 —— 采购管理 —— 采购单列表、采退单列表
 */

import type { MenuProps } from 'antd'

// 菜单项类型定义
export type MenuItem = Required<MenuProps>['items'][number] & {
  /** 唯一标识 */
  key: string
  /** 路由路径 */
  path?: string
  /** 子菜单 */
  children?: MenuItem[]
}

/**
 * 菜单配置 - 三级菜单结构
 * 第一级：销售中心、采购中心
 * 第二级：订单管理、采购管理
 * 第三级：订单列表、售后列表、采购单列表、采退单列表
 */
export const menuConfig: MenuItem[] = [
  // ==================== 销售中心 ====================
  {
    key: 'sales',
    label: '销售中心',
    icon: 'ShopOutlined',
    children: [
      {
        key: 'sales-order',
        label: '订单管理',
        icon: 'FileTextOutlined',
        children: [
          {
            key: '/sales/order/list',
            label: '订单列表',
            path: '/sales/order/list',
          },
          {
            key: '/sales/after-sale/list',
            label: '售后列表',
            path: '/sales/after-sale/list',
          },
        ],
      },
    ],
  },

  // ==================== 采购中心 ====================
  {
    key: 'purchase',
    label: '采购中心',
    icon: 'ShoppingCartOutlined',
    children: [
      {
        key: 'purchase-manage',
        label: '采购管理',
        icon: 'FileTextOutlined',
        children: [
          {
            key: '/purchase/order/list',
            label: '采购单列表',
            path: '/purchase/order/list',
          },
          {
            key: '/purchase/return/list',
            label: '采退单列表',
            path: '/purchase/return/list',
          },
        ],
      },
    ],
  },
]

/**
 * 将菜单配置扁平化为路由映射
 * 用于根据路径查找对应的菜单项
 */
export const flattenMenuConfig = (
  items: MenuItem[],
  parentPath = ''
): Map<string, MenuItem> => {
  const routeMap = new Map<string, MenuItem>()

  items.forEach((item) => {
    if (item && 'children' in item && item.children) {
      // 有子菜单，递归处理
      flattenMenuConfig(item.children, parentPath)
    } else if (item && 'path' in item && item.path) {
      // 叶子节点，添加到路由映射
      routeMap.set(item.path, item)
    }
  })

  return routeMap
}

export default menuConfig
