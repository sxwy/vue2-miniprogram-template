import http, { HTTP } from './http'
import { HTTPConfig } from './type'

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
        return response
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
