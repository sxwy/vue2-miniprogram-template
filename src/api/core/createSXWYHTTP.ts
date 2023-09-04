import http from './http'
import createDefaultHTTP from './createDefaultHTTP'
import { HTTPConfig } from './type'
import { isAuthorityError, isSessionExpiredError } from './error'
import store from '@/store'
import { handleLoginInvalid } from '@/utils'

let isRefreshToken = false
let httpList: (() => void)[] = []

export default (defaultConfig: HTTPConfig) => {
  const defaultHTTP = createDefaultHTTP({ showError: false, ...defaultConfig })

  defaultHTTP.interceptors.request.use(
    (httpConfig) => {
      const sxwySession = store.state.user.sxwySession
      if (sxwySession?.token) {
        httpConfig.header = {
          Authorization: `Bearer ${sxwySession.token}`,
          ...httpConfig.header
        }
      }
      return httpConfig
    },
    (error) => Promise.reject(error)
  )

  defaultHTTP.interceptors.response.use(
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
                  resolve(defaultHTTP.request(response.config))
                })
              })
            } else {
              isRefreshToken = true
              try {
                await store.dispatch('user/refreshToken')
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
              return defaultHTTP.request(response.config)
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
    (error: any) => {
      if (isAuthorityError(error)) {
        // 权限不足
        handleLoginInvalid(error.message)
      }
      return Promise.reject(error)
    }
  )

  return defaultHTTP
}
