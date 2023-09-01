import createDefaultHTTP from './createDefaultHTTP'
import { HTTPConfig } from './type'
import { isAuthorityError } from './error'
import { uniSDKConfig } from '../../config'
import { handleLoginInvalid } from '../../utils'

export default (defaultConfig: HTTPConfig) => {
  const defaultHTTP = createDefaultHTTP({ showError: false, ...defaultConfig })

  defaultHTTP.interceptors.request.use(
    (httpConfig) => {
      const store = uniSDKConfig.useStore()
      const sxwySession =
        store.state[uniSDKConfig.userModule as 'user'].sxwySession
      if (sxwySession?.accessToken && sxwySession?.sessionId) {
        httpConfig.header = {
          Authorization: `Bearer ${sxwySession.accessToken}`,
          Cookie: `JSESSIONID=${sxwySession.sessionId};ClientVersion=6.50`,
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
