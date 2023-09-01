import http, { HTTP } from './http'
import { HTTPConfig } from './type'
import { isSessionExpiredError } from './error'
import { uniSDKConfig } from '../../config'
import { handleLoginInvalid } from '../../utils'

let isRefreshToken = false
let httpList: (() => void)[] = []

export default (
  config: HTTPConfig & {
    showError?: boolean
  } = { showError: false }
): HTTP => {
  const { showError = false, ...requestConfig } = config

  const httpInstance = http.create({
    timeout: 30000,
    ...requestConfig
  })

  httpInstance.interceptors.response.use(
    async (response) => {
      if (Object.prototype.toString.call(response.data) === '[object Object]') {
        const keys = Reflect.ownKeys(response.data)
        if (keys.includes('code') || keys.includes('returncode')) {
          const code = String(response.data.code || response.data.returncode)
          if (code === '10000') {
            return response.data.body
          } else if (isSessionExpiredError(response.data)) {
            if (isRefreshToken) {
              return new Promise((resolve) => {
                Reflect.deleteProperty(
                  response.config.header as object,
                  'Authorization'
                )
                httpList.push(() => {
                  resolve(httpInstance.request(response.config))
                })
              })
            } else {
              isRefreshToken = true
              const store = uniSDKConfig.useStore()
              try {
                await store.dispatch(`${uniSDKConfig.userModule}/refreshToken`)
              } catch (error) {
                handleLoginInvalid()
                httpList = []
                isRefreshToken = false
                return Promise.reject(error)
              }
              httpList.forEach((cb) => {
                cb()
              })
              httpList = []
              isRefreshToken = false
              Reflect.deleteProperty(
                response.config.header as object,
                'Authorization'
              )
              return httpInstance.request(response.config)
            }
          } else {
            return Promise.reject(
              http.createError(
                code,
                response.data.message,
                response.config,
                response
              )
            )
          }
        } else if (keys.includes('flag')) {
          const flag = response.data.flag
          if (flag) {
            return response.data.data
          } else {
            return Promise.reject(
              http.createError(
                response.config.errorCode?.ERROR || '',
                response.data.msg,
                response.config,
                response
              )
            )
          }
        } else if (keys.includes('success')) {
          const success = response.data.success
          if (success) {
            return response.data.data
          } else {
            return Promise.reject(
              http.createError(
                response.data.errCode,
                response.data.errMessage,
                response.config,
                response
              )
            )
          }
        } else if (keys.includes('resultCode')) {
          const resultCode = response.data.resultCode
          if (resultCode === 0) {
            return response.data
          } else {
            return Promise.reject(
              http.createError(
                resultCode,
                response.data.error,
                response.config,
                response
              )
            )
          }
        } else {
          return Promise.reject(
            http.createError(
              response.config.errorCode?.ERROR || '',
              response.config.errorMessage?.ERROR || '',
              response.config,
              response
            )
          )
        }
      } else {
        return Promise.reject(
          http.createError(
            response.config.errorCode?.ERROR || '',
            response.config.errorMessage?.ERROR || '',
            response.config,
            response
          )
        )
      }
    },
    (error) => {
      if (
        error &&
        error.message &&
        (showError || error.config?.showError) &&
        error.code !== error.config?.errorCode?.ABORTED
      ) {
        uni.showToast({ icon: 'none', title: error.message, mask: true })
      }
      return Promise.reject(error)
    }
  )
  return httpInstance
}
