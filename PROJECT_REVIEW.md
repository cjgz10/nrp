# NRP 后台管理系统 - 项目 Review

## 📋 项目概述

| 项目名称 | nrp-admin |
|---------|-----------|
| 项目类型 | React 后台管理系统 (SPA) |
| 项目路径 | `nrp-admin/` |
| 构建工具 | Vite 7.x |
| 开发框架 | React 19 + TypeScript |

---

## 🛠 技术栈

### 核心框架
- **React** 19.2.4 - UI 框架
- **React Router DOM** 7.13.1 - 路由管理
- **TypeScript** 5.9.3 - 类型支持

### UI 组件库
- **Ant Design** 6.3.2 - 企业级 UI 组件库
- **@ant-design/x** 2.3.0 - Ant Design 扩展

### 状态管理
- **Zustand** 5.0.11 - 轻量级状态管理

### HTTP 请求
- **Axios** 1.13.6 - HTTP 客户端
- **Fetch API** - 原生支持（用于流式请求）

### 样式
- **Less** 4.6.3 - CSS 预处理器

### 构建工具
- **Vite** 7.3.1 - 下一代构建工具
- **@vitejs/plugin-react-swc** - React 插件 (SWC)

---

## 📁 项目结构

```
nrp-admin/
├── public/                    # 静态资源
│   └── vite.svg
├── src/
│   ├── components/            # 公共组件
│   │   └── Layout/
│   │       ├── MainLayout.tsx       # 主布局组件
│   │       ├── MainLayout.less
│   │       ├── TabNav.tsx           # 页签导航组件
│   │       └── TabNav.less
│   ├── pages/                 # 页面组件
│   │   ├── Home/              # 首页
│   │   ├── Sales/             # 销售中心
│   │   │   ├── Order/         # 订单管理
│   │   │   └── AfterSale/     # 售后管理
│   │   ├── Purchase/          # 采购中心
│   │   │   ├── PurchaseOrder/ # 采购管理
│   │   │   └── PurchaseReturn/# 采退管理
│   │   └── NotFound/          # 404 页面
│   ├── router/                # 路由配置
│   │   ├── routes.tsx         # 路由定义
│   │   └── menuConfig.ts      # 菜单配置
│   ├── store/                 # 状态管理
│   │   └── index.ts           # Zustand store
│   ├── styles/                # 全局样式
│   │   ├── global.css
│   │   └── variables.less
│   ├── utils/                 # 工具函数
│   │   ├── request.ts         # Axios 封装
│   │   └── fetch.ts            # Fetch API 封装
│   ├── App.tsx                # 应用入口
│   └── main.tsx               # 渲染入口
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔗 路由结构

| 一级菜单 | 二级菜单 | 三级菜单 | 路由路径 |
|---------|---------|---------|---------|
| 销售中心 | 订单管理 | 订单列表 | `/sales/order/list` |
| 销售中心 | 订单管理 | 售后列表 | `/sales/after-sale/list` |
| 销售中心 | 项目销售 | 项目列表 | `/sales/project-sale/list` |
| 销售中心 | 项目销售 | 新增项目 | `/sales/project-sale/add` |
| 采购中心 | 采购管理 | 采购单列表 | `/purchase/order/list` |
| 采购中心 | 采购管理 | 采退单列表 | `/purchase/return/list` |

**默认跳转**: 根路径 `/` → `/sales/order/list`

---

## 🎨 主题配置

### 主色调
- **Primary Color**: `#FF6900` (橙色)
- **Border Radius**: 4px

### 组件主题
- **Menu**: 选中背景 `rgba(255, 105, 0, 0.1)`，选中色 `#FF6900`
- **Button**: 主按钮色 `#FF6900`

---

## ⚙️ 配置说明

### Vite 配置 (`vite.config.ts`)
- 路径别名: `@/` → `src/`
- LESS 配置: 支持 JavaScript 的 LESS 变量

### TypeScript 配置 (`tsconfig.json`)
- 目标: ES2022
- 模块: ESNext
- 严格模式: 开启
- 路径别名: `@/*` → `src/*`

### 环境变量
- `VITE_API_BASE_URL` - API 基础地址（默认 `/api`）

---

## 🔌 API 请求工具

### request.ts (Axios 封装)
- 支持 GET/POST/PUT/DELETE/PATCH 方法
- 请求/响应拦截器
- Token 认证支持
- 错误处理（401 自动跳转登录）

### fetch.ts (Fetch API 封装)
- 支持流式请求（SSE）
- `streamRequest()` - 流式请求
- `fetchRequest()` - 普通请求

---

## 📦 状态管理 (Zustand)

### 侧边栏状态
- `collapsed` - 折叠状态
- `toggleCollapsed()` - 切换折叠
- `setCollapsed()` - 设置折叠

### 页签导航状态
- `tabs` - 页签列表
- `activeTab` - 当前激活页签
- `addTab()` - 添加页签
- `removeTab()` - 移除页签
- `setActiveTab()` - 设置激活页签
- `closeOtherTabs()` - 关闭其他
- `closeLeftTabs()` - 关闭左侧
- `closeRightTabs()` - 关闭右侧
- `closeAllTabs()` - 关闭所有

---

## 📝 现有页面状态

| 页面 | 状态 | 说明 |
|-----|------|-----|
| 首页 | ✅ 已实现 | 欢迎页面，基本结构 |
| 订单列表 | ⚠️ 预留 | 页面为空，待开发 |
| 售后列表 | ⚠️ 预留 | 页面为空，待开发 |
| 项目列表 | ✅ 已实现 | 销售公司、项目编号/名称、客户信息筛选，表格展示（新增业务员、设计师、施工经理、ERP项目编号字段），查看/编辑操作，新增项目按钮 |
| 新增项目 | ⚠️ 预留 | 页面为空，待开发 |
| 项目详情 | ✅ 已实现 | 项目详细信息展示（包含业务员、设计师、施工经理、ERP项目编号），返回列表、编辑操作 |
| 采购单列表 | ⚠️ 预留 | 页面为空，待开发 |
| 采退单列表 | ⚠️ 预留 | 页面为空，待开发 |
| 404 | ✅ 已实现 | 404 页面 |

---

## 🚀 常用命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

---

## 📌 注意事项

1. **页面开发**: 现有业务页面均为预留位置，内容为空
2. **API 对接**: `request.ts` 中已配置 API 基础路径，需配置 `VITE_API_BASE_URL`
3. **认证**: 401 错误时自动跳转 `/login`，需实现登录页面
4. **菜单配置**: 硬编码在 `MainLayout.tsx` 中，可提取到 `menuConfig.ts`

---

## 🔮 后续开发建议

1. 实现登录页面和认证流程
2. 完善各个业务列表页（订单、售后、采购、采退）
3. 添加 CRUD 操作（增删改查）
4. 集成真实后端 API
5. 提取菜单配置到独立文件
6. 添加权限管理模块
7. 添加表格组件、数据分页、筛选等功能

---

*生成时间: 2026/3/12*
