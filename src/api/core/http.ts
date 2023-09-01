import {
  HTTPConfig,
  HTTPRequestConfig,
  HTTPErrorConfig,
  HTTPResponse,
  HTTPCancellation
} from './type'
import { HTTPError, createError } from './error'
import { mergeHTTPConfig, buildFullPath } from './utils'

/** 默认的错误码配置 */
const defaultErrorCode: Required<HTTPErrorConfig> = {
  UNKNOWN: 'unknown',
  ABORTED: 'aborted',
  OFFLINE: 'offline',
  TIMEOUT: 'timeout',
  ERROR: 'error'
}

/** 默认的错误信息配置 */
const defaultErrorMessage: Required<HTTPErrorConfig> = {
  UNKNOWN: '未知错误',
  ABORTED: '请求取消',
  OFFLINE: '网络异常',
  TIMEOUT: '请求超时',
  ERROR: '服务异常'
}

/** 默认的 HTTP 配置 */
const defaults: HTTPConfig = {
  timeout: 60000,
  header: {
    Accept: 'application/json, text/plain, */*'
  },
  responseType: 'text',
  dataType: 'json',
  errorCode: defaultErrorCode,
  errorMessage: defaultErrorMessage
}

const dispatchRequest = (config: HTTPRequestConfig) => {
  const errorCodeConfig = config.errorCode || defaultErrorCode
  const errorMessageConfig = config.errorMessage || defaultErrorMessage

  if (config.cancellation?.aborted) {
    throw createError(
      errorCodeConfig.ABORTED || defaultErrorCode.ABORTED,
      errorMessageConfig.ABORTED || defaultErrorMessage.ABORTED,
      config
    )
  }

  return new Promise((resolve, reject) => {
    const requestTask = uni.request({
      url: buildFullPath(config.baseUrl, config.url),
      data: config.data,
      header: config.header,
      method: config.method,
      timeout: config.timeout,
      dataType: config.dataType,
      responseType: config.responseType,
      success: (response) => {
        const httpResponse: HTTPResponse = {
          ...response,
          config
        }
        resolve(httpResponse)
      },
      fail: (error) => {
        /**
         * - 取消：`{errMsg: "request:fail abort"}`
         * - 无网络：`{errMsg: "request:fail Failed to execute 'send' on 'XMLHttpRequest': Failed to load 'http://127.0.0.1:45182/apihelper/assdk?t=1634177427014'."}`
         * - 超时：`{errMsg: "request:fail timeout"}`
         */
        let errorCode = errorCodeConfig.UNKNOWN || defaultErrorCode.UNKNOWN
        let errorMessage =
          errorMessageConfig.UNKNOWN || defaultErrorMessage.UNKNOWN
        if (error.errMsg) {
          if (error.errMsg.indexOf('abort') >= 0) {
            errorCode = errorCodeConfig.ABORTED || defaultErrorCode.ABORTED
            errorMessage =
              errorMessageConfig.ABORTED || defaultErrorMessage.ABORTED
          } else if (error.errMsg.indexOf('timeout') >= 0) {
            errorCode = errorCodeConfig.TIMEOUT || defaultErrorCode.TIMEOUT
            errorMessage =
              errorMessageConfig.TIMEOUT || defaultErrorMessage.TIMEOUT
          } else {
            errorCode = errorCodeConfig.OFFLINE || defaultErrorCode.OFFLINE
            errorMessage =
              errorMessageConfig.OFFLINE || defaultErrorMessage.OFFLINE
          }
        }
        reject(createError(errorCode, errorMessage, config))
      }
    })
    if (config.cancellation) {
      config.cancellation.abort = () => requestTask.abort()
    }
  })
}

class InterceptorManager<V = any, E = any> {
  handlers: ({
    resolved: (value: V) => V | Promise<V>
    rejected: (error: E) => void
  } | null)[]

  constructor() {
    this.handlers = []
  }

  use(resolved: (value: V) => V | Promise<V>, rejected: (error: E) => void) {
    this.handlers.push({
      resolved,
      rejected
    })
    return this.handlers.length - 1
  }

  eject(id: number) {
    if (this.handlers[id]) {
      this.handlers[id] = null
    }
  }

  forEach(
    fn: (handler: {
      resolved: (value: V) => V | Promise<V>
      rejected: (error: E) => void
    }) => void
  ) {
    this.handlers.forEach((h) => {
      if (h !== null) {
        fn(h)
      }
    })
  }
}

export class HTTP {
  defaults: HTTPConfig
  interceptors: {
    request: InterceptorManager<HTTPRequestConfig, Error>
    response: InterceptorManager<HTTPResponse, HTTPError>
  }

  constructor(config: HTTPConfig) {
    this.defaults = config
    this.interceptors = {
      request: new InterceptorManager<HTTPRequestConfig, Error>(),
      response: new InterceptorManager<HTTPResponse, HTTPError>()
    }
  }

  /** 发送 HTTP 请求 */
  request<R = any, D = any>(config: HTTPRequestConfig<D>): Promise<R> {
    const requestConfig = mergeHTTPConfig(
      this.defaults,
      config
    ) as HTTPRequestConfig

    const chain: any[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]
    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor)
    })
    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(requestConfig)
    while (chain.length) {
      const { resolved, rejected } = chain.shift()
      promise = promise.then(resolved, rejected)
    }
    return promise as any
  }
}

const createCancellation = (): HTTPCancellation => {
  return {
    aborted: false,
    abort: () => null
  }
}

const isCancel = (error: HTTPError) => {
  return error.code === error.config?.errorCode?.ABORTED
}

const create = (config: HTTPConfig) => {
  const instanceConfig = mergeHTTPConfig(defaults, config)
  return new HTTP(instanceConfig)
}

const http: any = create(defaults)

http.create = create
http.createError = createError
http.createCancellation = createCancellation
http.isCancel = isCancel
http.HTTPError = HTTPError

export default http as HTTP & {
  readonly create: typeof create
  readonly createError: typeof createError
  readonly createCancellation: typeof createCancellation
  readonly isCancel: typeof isCancel
  readonly HTTPError: typeof HTTPError
}
