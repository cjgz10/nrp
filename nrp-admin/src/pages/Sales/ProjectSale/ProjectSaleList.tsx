/**
 * 项目销售 - 项目列表
 * 销售中心 -> 项目销售 -> 项目列表
 */

import { useState, useEffect, useMemo } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Table, 
  Space, 
  Pagination, 
  Tag,
  message 
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import styles from './ProjectSaleList.module.less'

// 项目列表查询参数
interface ProjectQueryParams {
  page: number
  pageSize: number
  companyIds?: number[]     // 销售公司ID列表
  projectCode?: string     // 项目编号
  projectName?: string     // 项目名称
  customerName?: string    // 客户姓名
  customerPhone?: string   // 客户手机号
  customerAddress?: string // 客户地址
  businessType?: string    // 业务类型
}

// 项目数据
interface ProjectItem {
  id: number
  projectCode: string       // 项目编号
  projectName: string       // 项目名称
  companyName: string       // 销售公司
  storeName: string         // 销售门店
  salesman: string          // 业务员
  designer: string          // 设计师
  constructionManager: string // 施工经理
  erpProjectCode: string    // ERP项目编号
  businessType: string      // 业务类型
  customerName: string      // 客户姓名
  customerPhone: string     // 客户电话
  customerAddress: string   // 客户地址
}

// 列表响应数据（保留用于后续API开发）
// interface ProjectListResponse {
//   list: ProjectItem[]
//   total: number
//   page: number
//   pageSize: number
// }

// 销售公司数据类型
interface CompanyItem {
  label: string
  value: number
}

// 业务类型选项
const businessTypeOptions = [
  { label: '全部', value: '' },
  { label: '家庭帮', value: 'family_help' },
  { label: '管道直饮水', value: 'pipe_water' },
]

// 生成100条模拟公司数据
const generateMockCompanies = (): CompanyItem[] => {
  const companies: CompanyItem[] = []
  const prefixes = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京', '西安', '重庆']
  const suffixes = ['房地产开发有限公司', '置业顾问有限公司', '物业管理有限公司', '投资有限公司', '实业有限公司', '贸易有限公司', '建设集团有限公司', '企业发展有限公司', '商业管理有限公司', '资产运营有限公司']
  
  for (let i = 1; i <= 100; i++) {
    const prefixIndex = (i - 1) % prefixes.length
    const suffixIndex = (i - 1) % suffixes.length
    const num = Math.floor((i - 1) / 10) + 1
    
    companies.push({
      label: `${prefixes[prefixIndex]}${num}${suffixes[suffixIndex]}`,
      value: i,
    })
  }
  return companies
}

// 业务员列表
const salesmen = ['王欢', '李明', '张三', '赵四', '钱五', '孙六', '周七', '吴八', '郑九', '王十']

// 设计师列表
const designers = ['李设计', '王设计', '张设计', '刘设计', '陈设计', '杨设计', '赵设计', '黄设计', '周设计', '吴设计']

// 施工经理列表
const constructionManagers = ['李经理', '王经理', '张经理', '刘经理', '陈经理', '杨经理', '赵经理', '黄经理', '周经理', '吴经理']

// 生成项目列表模拟数据
const generateMockData = (): ProjectItem[] => {
  const allCompanies = generateMockCompanies()
  const stores = ['XX花园店', 'YY家园店', 'ZZ广场店', 'WW商业街店', 'UU社区店']
  const businessTypes = ['family_help', 'pipe_water']
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二']
  const streets = ['XX路', 'YY路', 'ZZ路', 'WW路', 'UU路', 'TT路']
  const communities = ['XX花园', 'YY家园', 'ZZ小区', 'WW公馆', 'UU家园', 'TT雅苑']
  
  const data: ProjectItem[] = []
  for (let i = 1; i <= 100; i++) {
    const companyIndex = (i - 1) % allCompanies.length
    const storeIndex = (i - 1) % stores.length
    const nameIndex = (i - 1) % names.length
    const streetIndex = (i - 1) % streets.length
    const communityIndex = (i - 1) % communities.length
    const businessIndex = (i - 1) % businessTypes.length
    const salesmanIndex = (i - 1) % salesmen.length
    const designerIndex = (i - 1) % designers.length
    const managerIndex = (i - 1) % constructionManagers.length
    
    data.push({
      id: i,
      projectCode: `XM202603${String(i).padStart(5, '0')}`,
      projectName: `${communities[communityIndex]}${i}期`,
      companyName: allCompanies[companyIndex].label,
      storeName: stores[storeIndex],
      salesman: salesmen[salesmanIndex],
      designer: designers[designerIndex],
      constructionManager: constructionManagers[managerIndex],
      erpProjectCode: `340047${String(i).padStart(8, '0')}`,
      businessType: businessTypes[businessIndex],
      customerName: names[nameIndex],
      customerPhone: `138${String(i).padStart(8, '0')}`,
      customerAddress: `XX市XX区${streets[streetIndex]}${i}号${communities[communityIndex]}${(i % 30) + 1}号楼${(i % 30) + 1}01`,
    })
  }
  return data
}

const ProjectSaleList: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<ProjectItem[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  })

  // 销售公司选项（完整列表）
  const [allCompanyOptions, setAllCompanyOptions] = useState<CompanyItem[]>([])
  
  // 搜索关键词
  const [companySearchText, setCompanySearchText] = useState('')

  // 查询参数
  const [queryParams, setQueryParams] = useState<ProjectQueryParams>({
    page: 1,
    pageSize: 20,
  })

  // 根据搜索过滤公司选项

  const filteredCompanyOptions = useMemo(() => {
    if (!companySearchText) {
      return allCompanyOptions
    }
    return allCompanyOptions.filter(item => 
      item.label.toLowerCase().includes(companySearchText.toLowerCase())
    )
  }, [allCompanyOptions, companySearchText])

  // 表格列定义
  const columns: ColumnsType<ProjectItem> = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      fixed: 'left',
      render: (_: any, __: ProjectItem, index: number) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1
      },
    },
    {
      title: '项目编号',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: 140,
      fixed: 'left',
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '销售公司',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '销售门店',
      dataIndex: 'storeName',
      key: 'storeName',
      width: 120,
    },
    {
      title: '业务员',
      dataIndex: 'salesman',
      key: 'salesman',
      width: 100,
    },
    {
      title: '设计师',
      dataIndex: 'designer',
      key: 'designer',
      width: 100,
    },
    {
      title: '施工经理',
      dataIndex: 'constructionManager',
      key: 'constructionManager',
      width: 100,
    },
    {
      title: 'ERP项目编号',
      dataIndex: 'erpProjectCode',
      key: 'erpProjectCode',
      width: 140,
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      width: 100,
      render: (text: string) => {
        const option = businessTypeOptions.find(item => item.value === text)
        return option?.label || text
      },
    },
    {
      title: '客户姓名',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 100,
    },
    {
      title: '客户电话',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
      width: 120,
    },
    {
      title: '客户地址',
      dataIndex: 'customerAddress',
      key: 'customerAddress',
      width: 250,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: (_: any, record: ProjectItem) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button 
            type="link" 
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  // 获取销售公司选项
  const fetchCompanyOptions = async () => {
    try {
      // TODO: 替换为实际API
      // const res = await get('/api/company/list')
      // setAllCompanyOptions(res.data.map((item: any) => ({ label: item.name, value: item.id })))
      
      // 模拟数据 - 100条公司数据
      setAllCompanyOptions(generateMockCompanies())
    } catch (error) {
      console.error('获取销售公司失败:', error)
    }
  }

  // 获取项目列表
  const fetchProjectList = async () => {
    setLoading(true)
    try {
      // TODO: 替换为实际API
      // const res = await get<ProjectListResponse>('/api/project/list', queryParams)
      // setDataSource(res.list)
      // setPagination({ ...pagination, total: res.total })
      
      // 模拟数据 - 分页处理
      const allData = generateMockData()
      
      // 如果有筛选公司，按公司名称筛选
      let filteredData = allData
      if (queryParams.companyIds && queryParams.companyIds.length > 0) {
        const selectedCompanies = allCompanyOptions
          .filter(c => queryParams.companyIds?.includes(c.value))
          .map(c => c.label)
        filteredData = allData.filter(item => selectedCompanies.includes(item.companyName))
      }
      
      // 其他筛选条件
      if (queryParams.projectCode) {
        filteredData = filteredData.filter(item => 
          item.projectCode.includes(queryParams.projectCode!)
        )
      }
      if (queryParams.projectName) {
        filteredData = filteredData.filter(item => 
          item.projectName.includes(queryParams.projectName!)
        )
      }
      if (queryParams.customerName) {
        filteredData = filteredData.filter(item => 
          item.customerName.includes(queryParams.customerName!)
        )
      }
      if (queryParams.customerPhone) {
        filteredData = filteredData.filter(item => 
          item.customerPhone.includes(queryParams.customerPhone!)
        )
      }
      if (queryParams.customerAddress) {
        filteredData = filteredData.filter(item => 
          item.customerAddress.includes(queryParams.customerAddress!)
        )
      }
      if (queryParams.businessType) {
        filteredData = filteredData.filter(item => 
          item.businessType === queryParams.businessType
        )
      }
      
      const { page, pageSize } = queryParams
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const pageData = filteredData.slice(start, end)
      
      setDataSource(pageData)
      setPagination({ ...pagination, total: filteredData.length })
    } catch (error) {
      console.error('获取项目列表失败:', error)
      message.error('获取项目列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 页面加载时获取销售公司选项和列表数据
  useEffect(() => {
    fetchCompanyOptions()
  }, [])

  useEffect(() => {
    fetchProjectList()
  }, [queryParams, allCompanyOptions])

  // 查询
  const handleSearch = async () => {
    try {
      const values = await form.validateFields()
      setQueryParams({
        page: 1,
        pageSize: pagination.pageSize,
        companyIds: values.companyIds,
        projectCode: values.projectCode,
        projectName: values.projectName,
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerAddress: values.customerAddress,
        businessType: values.businessType,
      })
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  // 重置
  const handleReset = () => {
    form.resetFields()
    setCompanySearchText('')
    setQueryParams({
      page: 1,
      pageSize: pagination.pageSize,
    })
  }


  // 分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    setQueryParams({
      ...queryParams,
      page,
      pageSize,
    })
    setPagination({ ...pagination, current: page, pageSize })
  }

  // 公司选择变化
  const handleCompanyChange = (value: { label: string; value: number }[]) => {
    console.log('选择的公司:', value)
  }


  // 公司搜索
  const handleCompanySearch = (value: string) => {
    setCompanySearchText(value)
  }

  // 公司下拉打开
  const handleCompanyDropdownVisible = (open: boolean) => {
    if (!open) {
      setCompanySearchText('')
    }
  }

  // 查看 - 跳转到详情页
  const handleView = (record: ProjectItem) => {
    navigate(`/sales/project-sale/detail/${record.id}`)
  }

  // 编辑
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEdit = (_record: ProjectItem) => {
    message.info('编辑功能开发中...')
    // TODO: 跳转到编辑页
  }

  return (
    <div className={styles.container}>
      {/* 筛选区域 */}
      <Card className={styles.filterCard}>
        <Form
          form={form}
          layout="inline"
          className={styles.filterForm}
        >
          <Form.Item name="companyIds" label="销售公司">
            <Select
              mode="multiple"
              placeholder="请输入公司名称搜索"
              options={filteredCompanyOptions}
              style={{ width: 240 }}




              allowClear
              showSearch
              filterOption={false}
              onSearch={handleCompanySearch}
              onChange={handleCompanyChange}
              onDropdownVisibleChange={handleCompanyDropdownVisible}
              labelInValue
              maxTagCount={0}
              className={styles.companySelectWrap}
              maxTagPlaceholder={(omittedValues) => {
                // omittedValues 是被省略的值（当 maxTagCount=0 时，这里会收到所有选择的值）
                const values = omittedValues as { label: string; value: number }[]
                if (!values || values.length === 0) {
                  return null
                }
                if (values.length === 1) {
                // 只选择一个公司时，直接显示公司名称
                  return <Tag color="orange" className={styles.companyTag}>{values[0].label}</Tag>
                }
                // 选择多家公司时，显示第一个公司名称 + 数字
                const firstCompany = values[0]
                const displayName = firstCompany.label.length > 10 
                  ? firstCompany.label.substring(0, 10) + '...'
                  : firstCompany.label
                return <Tag color="orange" className={styles.companyTag}>{displayName} {values.length}</Tag>


              }}

              dropdownRender={(menu) => (
                <>
                  {menu}
                  {companySearchText && filteredCompanyOptions.length === 0 && (
                    <div style={{ padding: '8px', color: '#999', textAlign: 'center' }}>
                      未找到匹配的公司
                    </div>
                  )}
                </>
              )}
            />
          </Form.Item>



          <Form.Item name="projectCode" label="项目编号">
            <Input placeholder="请输入项目编号" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item name="projectName" label="项目名称">
            <Input placeholder="请输入项目名称" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item name="customerName" label="客户姓名">
            <Input placeholder="请输入客户姓名" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="customerPhone" label="客户手机号">
            <Input placeholder="请输入客户手机号" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="customerAddress" label="客户地址">
            <Input placeholder="请输入客户地址" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item name="businessType" label="业务类型" initialValue="">
            <Select
              placeholder="请选择业务类型"
              options={businessTypeOptions}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSearch} className={styles.searchButton}>
                查询
              </Button>
              <Button onClick={handleReset} className={styles.resetButton}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 列表区域 */}
      <Card className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <Button 
            type="primary" 
            onClick={() => navigate('/sales/project-sale/add')}
            className={styles.addButton}
          >
            新增
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1900, y: 'calc(100vh - 360px)' }}
          pagination={false}
        />
      </Card>

      {/* 分页组件 - 固定在底部 */}
      <div className={styles.paginationWrapper}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条`}
          locale={{
            items_per_page: '条/页',
            jump_to: '跳至',
            page: '页',
            prev_page: '上一页',
            next_page: '下一页',
            prev_5: '向前5页',
            next_5: '向后5页',
            prev_3: '向前3页',
            next_3: '向后3页',
          }}
        />
      </div>
    </div>
  )
}

export default ProjectSaleList
