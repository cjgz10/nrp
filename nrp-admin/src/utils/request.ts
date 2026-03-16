/**
 * Axios 请求工具
 * 基于 Axios 封装的 HTTP 请求库
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

// 创建 axios 实例
const axiosInstance: AxiosInstance = axios.create({
  // 基础请求地址
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  // 请求超时时间
  timeout: 30000,
  // 请求头
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 在请求发送前可以添加 token 等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    // 请求错误处理
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 响应成功处理
    const { data } = response
    // 根据后端返回的状态码进行处理
    if (data.code === 200 || data.success) {
      return data
    }
    // 业务错误
    console.error('Business Error:', data.message || '请求失败')
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  (error: AxiosError) => {
    // 响应错误处理
    if (error.response) {
      // 服务器响应了错误状态码
      const status = error.response.status
      switch (status) {
        case 401:
          // 未授权，清除 token 并跳转登录页
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          console.error('拒绝访问')
          break
        case 404:
          console.error('请求资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error('请求失败')
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('网络错误，请检查网络连接')
    } else {
      // 请求配置错误
      console.error('请求配置错误:', error.message)
    }
    return Promise.reject(error)
  }
)

/**
 * 封装 GET 请求
 */
export const get = <T = any>(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<T> => {
  return axiosInstance.get(url, { params, ...config })
}

/**
 * 封装 POST 请求
 */
export const post = <T = any>(
  url: string,
  data?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<T> => {
  return axiosInstance.post(url, data, config)
}

/**
 * 封装 PUT 请求
 */
export const put = <T = any>(
  url: string,
  data?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<T> => {
  return axiosInstance.put(url, data, config)
}

/**
 * 封装 DELETE 请求
 */
export const del = <T = any>(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<T> => {
  return axiosInstance.delete(url, { params, ...config })
}

/**
 * 封装 PATCH 请求
 */
export const patch = <T = any>(
  url: string,
  data?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<T> => {
  return axiosInstance.patch(url, data, config)
}

// 导出 axios 实例，供高级用法
export { axiosInstance }

export default axiosInstance
