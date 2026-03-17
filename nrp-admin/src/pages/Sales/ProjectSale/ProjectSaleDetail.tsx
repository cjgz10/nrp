/**
 * 项目销售 - 项目详情
 * 销售中心 -> 项目销售 -> 项目详情
 */

import { useEffect, useState } from 'react'
import { 
  Card, 
  Descriptions, 
  Spin, 
  message,
  Tabs,
  Table
} from 'antd'
import { useParams } from 'react-router-dom'
import type { TabsProps } from 'antd'
import styles from './ProjectSaleDetail.module.less'

// 项目数据接口 - 扩展完整字段
interface ProjectDetailData {
  // 基本信息
  projectName: string           // 项目名称
  businessType: string           // 业务类型
  salesman: string              // 业务员
  store: string                  // 门店
  company: string                // 公司
  designer: string               // 设计师
  projectCode: string            // 项目编号
  erpProjectCode: string         // ERP项目编号
  relatedOpportunity: string     // 关联商机
  customer: string               // 客户
  channel: string                // 渠道
  projectAmount: number          // 项目金额
  signAmount: number             // 签约金额
  changeAmount: number           // 变更金额
  receivedAmount: number         // 已收款金额
  receiptRatio: number           // 收款比例
  constructionMode: string       // 施工模式
  constructionManager: string   // 施工经理

  // 客户信息
  customerName: string           // 客户姓名
  customerPhone: string           // 客户手机号
  customerArea: string           // 客户地区
  detailAddress: string          // 详细地址
  idCardOrCreditCode: string     // 客户身份证号/统一社会信用代码

  // 空间信息
  spaces: SpaceInfo[]             // 空间信息数组
}

// 空间信息
interface SpaceInfo {
  spaceType: string              // 空间类型
  spaceTypeName: string          // 空间类型名称
  area: number                   // 改造面积
}

// 标签页类型
type TabKey = 'basic' | 'quote' | 'contract' | 'contractOutput' | 'budget' | 'budgetDetail' | 'order' | 'payment' | 'settlement' | 'output'

// 合同产值记录
interface ContractOutputRecord {
  id: string               // 合同产值记录ID（唯一编码）
  contractCode: string     // 合同编号
  confirmTime: string      // 合同产值确认时间
  outputAmount: number     // 合同产值（正数或负数）
}

// 格式化金额 - 千分位分隔符，保留2位小数
const formatAmount = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) {
    return '0.00'
  }
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 格式化百分比 - 保留2位小数
const formatPercent = (percent: number | undefined | null): string => {
  if (percent === undefined || percent === null) {
    return '0.00%'
  }
  return `${percent.toFixed(2)}%`
}

// 格式化空值 - 显示为 ---
const formatEmpty = (value: string | undefined | null): string => {
  if (!value || value === '' || value === null || value === undefined) {
    return '---'
  }
  return value
}

// 格式化脱敏身份证号
const formatIdCard = (idCard: string | undefined | null): string => {
  if (!idCard || idCard === '' || idCard === null || idCard === undefined) {
    return '---'
  }
  // 脱敏处理：显示前3位和后3位，中间用*代替
  if (idCard.length >= 6) {
    return idCard.substring(0, 3) + '*'.repeat(idCard.length - 6) + idCard.substring(idCard.length - 3)
  }
  return idCard
}

// 业务类型映射

const businessTypeMap: Record<string, string> = {
  'family_help': '家庭帮',
  'pipe_water': '管道直饮水',
}

// 施工模式映射
const constructionModeMap: Record<string, string> = {
  'full_package': '整装-发包模式',
  'half_package': '半包模式',
}

// 生成模拟详情数据
const generateMockDetailData = (id: number): ProjectDetailData => {
  const businessTypes = ['family_help', 'pipe_water']
  const constructionModes = ['full_package', 'half_package']
  
  return {
    // 基本信息
    projectName: '合景1151',
    businessType: businessTypes[(id - 1) % businessTypes.length],
    salesman: '王欢',
    store: '无为分公司城中营业厅',
    company: '壹品慧生活科技有限公司无为分公司',
    designer: '',
    projectCode: `JTB202603140000${id}`,
    erpProjectCode: '34004726MB0210',
    relatedOpportunity: `XS20260314000000${id + 1}`,
    customer: `匿名会员(13550269087)`,
    channel: '',
    projectAmount: 2056.03 + (id * 100),
    signAmount: 2056.03 + (id * 100),
    changeAmount: 0,
    receivedAmount: 1000 + (id * 50),
    receiptRatio: (1000 + (id * 50)) / (2056.03 + (id * 100)) * 100,
    constructionMode: constructionModes[(id - 1) % constructionModes.length],
    constructionManager: '',

    // 客户信息
    customerName: '清晨',
    customerPhone: '13550269087',
    customerArea: '安徽省芜湖市无为市无城镇',
    detailAddress: '1',
    idCardOrCreditCode: '510**********003*',

    // 空间信息
    spaces: [
      { spaceType: 'kitchen', spaceTypeName: '厨房', area: 8 },
      { spaceType: 'mainBathroom', spaceTypeName: '主卫', area: 5 },
    ],
  }
}

// 生成合同产值模拟数据
// 规则：HTCZ + {合同编号后13位数字} + {两位数自增数字}
const generateMockContractOutput = (projectId: number): ContractOutputRecord[] => {
  // 合同编号示例：HT2026031500001，后13位为 2026031500001
  const contractCode1 = `HT202603150000${projectId}`
  const contractCodeSuffix1 = contractCode1.substring(2, 15) // 获取后13位数字
  
  const contractCode2 = `HT202603100000${projectId}`
  const contractCodeSuffix2 = contractCode2.substring(2, 15) // 获取后13位数字

  const records: ContractOutputRecord[] = [
    {
      id: `HTCZ${contractCodeSuffix1}01`,
      contractCode: contractCode1,
      confirmTime: '2026-03-15 23:45:13',
      outputAmount: 999.99,
    },
    {
      id: `HTCZ${contractCodeSuffix1}02`,
      contractCode: contractCode1,
      confirmTime: '2026-03-10 10:30:00',
      outputAmount: 1500.00,
    },
    {
      id: `HTCZ${contractCodeSuffix2}03`,
      contractCode: contractCode2,
      confirmTime: '2026-03-05 15:20:45',
      outputAmount: -500.00,
    },
  ]
  return records
}

const ProjectSaleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [projectData, setProjectData] = useState<ProjectDetailData | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('basic')
  const [contractOutputData, setContractOutputData] = useState<ContractOutputRecord[]>([])

  // 模拟获取项目详情数据
  useEffect(() => {
    const fetchProjectDetail = async () => {
      setLoading(true)
      try {
        // TODO: 替换为实际API调用
        // const res = await get<ProjectDetailData>(`/api/project/${id}`)
        // setProjectData(res.data)
        
        // 模拟数据
        const projectId = parseInt(id || '0', 10)
        if (projectId > 0 && projectId <= 100) {
          const data = generateMockDetailData(projectId)
          setProjectData(data)
          // 生成合同产值模拟数据
          setContractOutputData(generateMockContractOutput(projectId))
        } else {
          message.error('项目不存在')
        }
      } catch (error) {
        console.error('获取项目详情失败:', error)
        message.error('获取项目详情失败')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProjectDetail()
    }
  }, [id])

  // 标签页切换
  const handleTabChange = (key: string) => {
    setActiveTab(key as TabKey)
  }

  // 标签页内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo()
      case 'quote':
        return <div className={styles.emptyContent}>报价单模块开发中...</div>
      case 'contract':
        return <div className={styles.emptyContent}>关联合同模块开发中...</div>
      case 'contractOutput':
        return renderContractOutput()
      case 'budget':
        return <div className={styles.emptyContent}>预算单模块开发中...</div>
      case 'budgetDetail':
        return <div className={styles.emptyContent}>预算清单模块开发中...</div>
      case 'order':
        return <div className={styles.emptyContent}>关联订单/售后模块开发中...</div>
      case 'payment':
        return <div className={styles.emptyContent}>收款/退款记录模块开发中...</div>
      case 'settlement':
        return <div className={styles.emptyContent}>结算退款记录模块开发中...</div>
      case 'output':
        return <div className={styles.emptyContent}>完成产值模块开发中...</div>
      default:
        return null
    }
  }

// 渲染合同产值标签页内容
  const renderContractOutput = () => {
    // 计算合同产值总计
    const totalOutput = contractOutputData.reduce((sum, record) => sum + record.outputAmount, 0)

    // 获取金额样式类名
    const getAmountClassName = (amount: number): string => {
      if (amount > 0) return styles.outputPositive
      if (amount < 0) return styles.outputNegative
      return styles.outputZero
    }

// 格式化金额显示
    const formatOutputAmount = (amount: number): string => {
      if (amount > 0) return `¥${formatAmount(amount)}`
      if (amount < 0) return `-¥${formatAmount(Math.abs(amount))}`
      return `¥${formatAmount(amount)}`
    }

    return (
      <div className={styles.basicInfoContent}>
        {/* 合同产值总计 */}
        <div className={styles.section}>
          <div className={styles.totalOutput}>
            合同产值总计：
            <span className={getAmountClassName(totalOutput)}>
              {formatOutputAmount(totalOutput)}
            </span>
          </div>
        </div>
        
        {/* 合同产值记录列表 */}
        <div className={styles.section}>
          <Table
            dataSource={contractOutputData}
            rowKey="id"
            pagination={false}
            className={styles.contractOutputTable}
            size="small"
          >
            <Table.Column 
              title="合同产值记录ID" 
              dataIndex="id" 
              key="id"
              width={180}
            />
            <Table.Column 
              title="合同编号" 
              dataIndex="contractCode" 
              key="contractCode"
              width={180}
            />
            <Table.Column 
              title="合同产值确认时间" 
              dataIndex="confirmTime" 
              key="confirmTime"
              width={200}
            />
            <Table.Column 
              title="合同产值" 
              dataIndex="outputAmount" 
              key="outputAmount"
              width={150}
              render={(amount: number) => (
                <span className={getAmountClassName(amount)}>
                  {formatOutputAmount(amount)}
                </span>
              )}
            />
          </Table>
        </div>
      </div>
    )
  }

  // 渲染基本信息标签页内容
  const renderBasicInfo = () => {
    if (!projectData) return null

    return (
      <div className={styles.basicInfoContent}>
        {/* 基本信息模块 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>基本信息</h3>
          <Descriptions bordered column={3} className={styles.descriptions}>
            <Descriptions.Item label="项目名称">{projectData.projectName}</Descriptions.Item>
            <Descriptions.Item label="业务类型">
              {businessTypeMap[projectData.businessType] || projectData.businessType}
            </Descriptions.Item>
            <Descriptions.Item label="业务员">{projectData.salesman}</Descriptions.Item>
            <Descriptions.Item label="门店">{projectData.store}</Descriptions.Item>
            <Descriptions.Item label="公司" span={2}>{projectData.company}</Descriptions.Item>
            <Descriptions.Item label="设计师">
              <span className={styles.emptyValue}>{formatEmpty(projectData.designer)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="项目编号">{projectData.projectCode}</Descriptions.Item>
            <Descriptions.Item label="ERP项目编号">{projectData.erpProjectCode}</Descriptions.Item>
            <Descriptions.Item label="关联商机">{projectData.relatedOpportunity}</Descriptions.Item>
            <Descriptions.Item label="客户" span={2}>{projectData.customer}</Descriptions.Item>
            <Descriptions.Item label="渠道">
              <span className={styles.emptyValue}>{formatEmpty(projectData.channel)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="项目金额">
              <span className={styles.amount}>¥{formatAmount(projectData.projectAmount)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="签约金额">
              <span className={styles.amount}>¥{formatAmount(projectData.signAmount)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="变更金额">
              <span className={styles.amount}>¥{formatAmount(projectData.changeAmount)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="已收款金额">
              <span className={styles.amount}>¥{formatAmount(projectData.receivedAmount)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="收款比例">
              <span className={styles.percent}>{formatPercent(projectData.receiptRatio)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="施工模式">
              {constructionModeMap[projectData.constructionMode] || projectData.constructionMode}
            </Descriptions.Item>
            <Descriptions.Item label="施工经理">
              <span className={styles.emptyValue}>{formatEmpty(projectData.constructionManager)}</span>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* 客户信息模块 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>客户信息</h3>
          <Descriptions bordered column={3} className={styles.descriptions}>
            <Descriptions.Item label="客户姓名">{projectData.customerName}</Descriptions.Item>
            <Descriptions.Item label="客户手机号">{projectData.customerPhone}</Descriptions.Item>
            <Descriptions.Item label="客户地区">{projectData.customerArea}</Descriptions.Item>
            <Descriptions.Item label="详细地址">{projectData.detailAddress}</Descriptions.Item>
            <Descriptions.Item label="身份证号/统一社会信用代码">
              {formatIdCard(projectData.idCardOrCreditCode)}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* 空间信息模块 */}
        {projectData.spaces && projectData.spaces.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>空间信息</h3>
            <Table
              dataSource={projectData.spaces}
              rowKey="spaceType"
              pagination={false}
              className={styles.spaceTable}
              size="small"
            >
              <Table.Column 
                title="空间类型" 
                dataIndex="spaceTypeName" 
                key="spaceTypeName"
              />
              <Table.Column 
                title="改造面积（平方）" 
                dataIndex="area" 
                key="area"
                render={(area: number) => area || '---'}
              />
            </Table>
          </div>
        )}
      </div>
    )
  }

// 标签页配置
  const tabItems: TabsProps['items'] = [
    {
      key: 'basic',
      label: '项目详情',
      children: renderTabContent(),
    },
    {
      key: 'quote',
      label: '报价单',
      children: renderTabContent(),
    },
    {
      key: 'contract',
      label: '关联合同',
      children: renderTabContent(),
    },
    {
      key: 'contractOutput',
      label: '合同产值',
      children: renderTabContent(),
    },
    {
      key: 'budget',
      label: '预算单',
      children: renderTabContent(),
    },
    {
      key: 'budgetDetail',
      label: '预算清单',
      children: renderTabContent(),
    },
    {
      key: 'order',
      label: '关联订单/售后',
      children: renderTabContent(),
    },
    {
      key: 'payment',
      label: '收款/退款记录',
      children: renderTabContent(),
    },
    {
      key: 'settlement',
      label: '结算退款记录',
      children: renderTabContent(),
    },
    {
      key: 'output',
      label: '完成产值',
      children: renderTabContent(),
    },
  ]

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    )
  }

  if (!projectData) {
    return null
  }

  return (
    <div className={styles.container}>
      {/* 标签栏和内容区域 */}
      <Card className={styles.contentCard}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          className={styles.tabs}
        />
      </Card>
    </div>
  )
}

export default ProjectSaleDetail
