/**
 * 页签导航组件
 * 显示所有已打开的页面，支持点击切换、右键菜单关闭等功能
 */

import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Tabs, Dropdown, type MenuProps } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useAppStore, type Tab } from '@/store'
import './TabNav.less'

// 页签标题映射
const tabTitleMap: Record<string, string> = {
  '/': '首页',
  '/sales/order/list': '订单列表',
  '/sales/after-sale/list': '售后列表',
  '/sales/project-sale/list': '项目列表',
  '/sales/project-sale/add': '新增项目',
  '/purchase/order/list': '采购单列表',
  '/purchase/return/list': '采退单列表',
}

// 检查路径是否为项目详情页
const isProjectDetailPath = (path: string): boolean => {
  return /^\/sales\/project-sale\/detail\/\d+$/.test(path)
}

// 首页key
const HOME_KEY = '/'

/**
 * 页签导航组件
 */
const TabNav: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { tabs, activeTab, addTab, removeTab, setActiveTab, closeOtherTabs, closeLeftTabs, closeRightTabs, closeAllTabs } = useAppStore()

  // 获取页签标题
  const getTabTitle = (path: string): string => {
    // 检查是否为项目详情页
    if (isProjectDetailPath(path)) {
      return '项目详情'
    }
    return tabTitleMap[path] || '未命名'
  }

  // 监听路由变化，自动添加页签
  const currentPath = location.pathname
  useEffect(() => {
    if (currentPath !== '/' && currentPath !== HOME_KEY && !tabs.some(t => t.key === currentPath)) {
      const title = getTabTitle(currentPath)
      addTab({
        key: currentPath,
        title,
        closable: true,
      })
    }
  }, [currentPath])

  // 点击页签切换
  const handleTabClick = (key: string) => {
    setActiveTab(key)
    navigate(key)
  }

  // 关闭页签
  const handleTabClose = (key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (key === activeTab) {
      // 找到前一个或后一个页签
      const currentIndex = tabs.findIndex(t => t.key === key)
      const prevTab = tabs[currentIndex - 1]
      const nextTab = tabs[currentIndex + 1]
      const targetTab = prevTab || nextTab
      if (targetTab) {
        navigate(targetTab.key)
      }
    }
    removeTab(key)
  }

  // 获取右键菜单配置
  const getContextMenuItems = (tabKey: string): MenuProps['items'] => {
    // 首页不显示右键菜单
    if (tabKey === HOME_KEY) {
      return []
    }
    return [
      {
        key: 'closeOther',
        label: '关闭其他',
        onClick: () => {
          closeOtherTabs(tabKey)
        },
      },
      {
        key: 'closeLeft',
        label: '关闭左侧',
        onClick: () => {
          closeLeftTabs(tabKey)
        },
      },
      {
        key: 'closeRight',
        label: '关闭右侧',
        onClick: () => {
          closeRightTabs(tabKey)
        },
      },
      {
        key: 'closeAll',
        label: '关闭所有',
        onClick: () => {
          closeAllTabs()
          navigate(HOME_KEY)
        },
      },
    ]
  }

  // 排序页签，确保首页始终在最左边
  const sortedTabs = [...tabs].sort((a, b) => {
    if (a.key === HOME_KEY) return -1
    if (b.key === HOME_KEY) return 1
    return 0
  })

  // 渲染页签
  const items = sortedTabs.map((tab: Tab) => ({
    key: tab.key,
    closable: tab.key !== HOME_KEY && tab.closable,
    label: (
      <Dropdown
        menu={{ items: getContextMenuItems(tab.key) }}
        trigger={['contextMenu']}
      >
        <div 
          className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => handleTabClick(tab.key)}
        >
          <span className="tab-title">
            {tab.title}
          </span>
          {tab.closable && (
            <CloseOutlined 
              className="tab-close" 
              onClick={(e) => handleTabClose(tab.key, e)}
            />
          )}
        </div>
      </Dropdown>
    ),
  }))

  return (
    <div className="tab-nav">
      <Tabs
        activeKey={activeTab}
        hideAdd
        type="card"
        items={items}
        onChange={(key) => handleTabClick(key)}
      />
    </div>
  )
}

export default TabNav
