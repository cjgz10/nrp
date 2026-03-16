/**
 * 入口文件
 * 渲染 React 应用
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// 引入全局样式
import './styles/global.css'

// 创建根节点并渲染应用
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
