import createDefaultHTTP from './createDefaultHTTP'
import { HTTPConfig } from './type'
import { isAuthorityError } from './error'
import store from '@/store'
import { handleLoginInvalid } from '@/utils'

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
    (response) => {
      return response
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
