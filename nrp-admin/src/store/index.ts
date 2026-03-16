/**
 * Zustand 状态管理
 * 用于管理全局状态，如用户信息、侧边栏折叠状态、页签导航等
 */

import { create } from 'zustand'

/**
 * 页签类型
 */
export interface Tab {
  key: string
  title: string
  closable: boolean
}

/**
 * 应用状态接口
 */
interface AppState {
  // 侧边栏是否折叠
  collapsed: boolean
  // 切换侧边栏折叠状态
  toggleCollapsed: () => void
  // 设置侧边栏折叠状态
  setCollapsed: (collapsed: boolean) => void
  
  // 页签相关
  tabs: Tab[]
  activeTab: string
  // 添加页签
  addTab: (tab: Tab) => void
  // 移除页签
  removeTab: (key: string) => void
  // 设置激活页签
  setActiveTab: (key: string) => void
  // 关闭其他页签（保留首页和当前页签）
  closeOtherTabs: (key: string) => void
  // 关闭左侧页签
  closeLeftTabs: (key: string) => void
  // 关闭右侧页签
  closeRightTabs: (key: string) => void
  // 关闭所有页签（只保留首页）
  closeAllTabs: () => void
}

// 首页配置
const HOME_TAB: Tab = {
  key: '/',
  title: '首页',
  closable: false,
}

// 创建 Zustand store
export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  collapsed: false,
  
  // 切换侧边栏折叠状态
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
  
  // 设置侧边栏折叠状态
  setCollapsed: (collapsed) => set({ collapsed }),
  
  // 页签初始状态 - 默认打开首页
  tabs: [HOME_TAB],
  activeTab: HOME_TAB.key,
  
  // 添加页签
  addTab: (tab) => {
    const { tabs } = get()
    // 检查页签是否已存在
    const exists = tabs.some(t => t.key === tab.key)
    if (!exists) {
      set({ tabs: [...tabs, tab] })
    }
    set({ activeTab: tab.key })
  },
  
  // 移除页签
  removeTab: (key) => {
    const { tabs, activeTab } = get()
    // 首页不能关闭
    if (key === HOME_TAB.key) return
    
    const newTabs = tabs.filter(t => t.key !== key)
    set({ tabs: newTabs })
    
    // 如果关闭的是当前激活的页签，切换到最后一个页签
    if (activeTab === key) {
      const newActiveTab = newTabs[newTabs.length - 1]?.key || HOME_TAB.key
      set({ activeTab: newActiveTab })
    }
  },
  
  // 设置激活页签
  setActiveTab: (key) => {
    set({ activeTab: key })
  },
  
  // 关闭其他页签（保留首页和当前页签）
  closeOtherTabs: (key) => {
    const { tabs } = get()
    const newTabs = tabs.filter(t => t.key === HOME_TAB.key || t.key === key)
    set({ tabs: newTabs, activeTab: key })
  },
  
  // 关闭左侧页签
  closeLeftTabs: (key) => {
    const { tabs } = get()
    const keyIndex = tabs.findIndex(t => t.key === key)
    const newTabs = tabs.filter((t, index) => index >= keyIndex || !t.closable)
    set({ tabs: newTabs })
  },
  
  // 关闭右侧页签
  closeRightTabs: (key) => {
    const { tabs } = get()
    const keyIndex = tabs.findIndex(t => t.key === key)
    const newTabs = tabs.filter((t, index) => index <= keyIndex || !t.closable)
    set({ tabs: newTabs })
  },
  
  // 关闭所有页签（只保留首页）
  closeAllTabs: () => {
    set({ tabs: [HOME_TAB], activeTab: HOME_TAB.key })
  },
}))

export default useAppStore
