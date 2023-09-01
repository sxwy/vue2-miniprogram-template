/** HTTP 请求头 */
export type HTTPRequestHeader = Record<string, string>

/** HTTP 响应头 */
export type HTTPResponseHeader = Record<string, string>

/** HTTP 响应数据类型 */
export type HTTPResponseType = 'text' | 'arraybuffer'

/** HTTP 返回的数据格式 */
export type HTTPDataType = 'json'

/** HTTP 请求方法 */
export type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'HEAD'
  | 'OPTIONS'
  | 'TRACE'

/** HTTP 请求取消实例 */
export interface HTTPCancellation {
  aborted?: boolean
  abort: () => void
}

/** HTTP 错误配置，可用于 errorCode 和 errorMessage */
export interface HTTPErrorConfig {
  /** 未知错误 */
  UNKNOWN?: string
  /** 请求被取消 */
  ABORTED?: string
  /** 网络未连接 */
  OFFLINE?: string
  /** 请求超时 */
  TIMEOUT?: string
  /** 服务异常 */
  ERROR?: string
  [key: string]: string | undefined
}

/** HTTP 配置 */
export interface HTTPConfig {
  /** 请求的基础路径 */
  baseUrl?: string
  /** 超时时间，单位 ms，默认 60000 */
  timeout?: number
  /** 设置请求的 header，header 中不能设置 Referer */
  header?: HTTPRequestHeader
  /** 设置响应的数据类型。合法值：text、arraybuffer */
  responseType?: HTTPResponseType
  /** 如果设为 json，会尝试对返回的数据做一次 JSON.parse */
  dataType?: HTTPDataType
  /** 跨域请求时是否携带凭证（cookies） */
  withCredentials?: boolean
  /** 响应错误码 */
  errorCode?: HTTPErrorConfig
  /** 响应错误信息 */
  errorMessage?: HTTPErrorConfig
}

/** HTTP 请求配置 */
export interface HTTPRequestConfig<D = any> extends HTTPConfig {
  /** 开发者服务器接口地址 */
  url: string
  /** 请求方法 */
  method?: HTTPMethod
  /** 请求的参数，Object/String/ArrayBuffer */
  data?: D
  /** 是否展示错误 */
  showError?: boolean
  /** 取消任务 */
  cancellation?: HTTPCancellation
}

/** HTTP 响应值 */
export interface HTTPResponse<D = any, R = any> {
  /** 开发者服务器返回的数据 */
  data: D
  /** 开发者服务器返回的 HTTP 状态码  */
  statusCode: number
  /** 开发者服务器返回的 HTTP Response Header */
  header: HTTPResponseHeader
  /** 开发者服务器返回的 cookies，格式为字符串数组 */
  cookies: string[]
  /** 请求配置 */
  config: HTTPRequestConfig<R>
}
