/**
 * Fetch API 工具
 * 用于流式请求（如 SSE、Server-Sent Events）
 */

/**
 * 流式请求选项
 */
export interface StreamRequestOptions {
  /** 请求地址 */
  url: string
  /** 请求方法 */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  /** 请求头 */
  headers?: Record<string, string>
  /** 请求体 */
  body?: any
  /** 数据块回调 */
  onChunk: (data: string) => void
  /** 完成回调 */
  onComplete?: () => void
  /** 错误回调 */
  onError?: (error: Error) => void
}

/**
 * 发起流式请求
 */
export const streamRequest = async (options: StreamRequestOptions): Promise<void> => {
  const {
    url,
    method = 'GET',
    headers = {},
    body,
    onChunk,
    onComplete,
    onError,
  } = options

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`)
    }

    // 获取响应体reader
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('无法读取响应流')
    }

    // 解码器
    const decoder = new TextDecoder()

    // 持续读取流数据
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        // 流结束
        onComplete?.()
        break
      }

      // 解码数据块
      const chunk = decoder.decode(value, { stream: true })
      onChunk(chunk)
    }
  } catch (error) {
    // 错误处理
    if (error instanceof Error) {
      onError?.(error)
    } else {
      onError?.(new Error('未知错误'))
    }
  }
}

/**
 * 发起普通 Fetch 请求
 */
export const fetchRequest = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export default fetchRequest
