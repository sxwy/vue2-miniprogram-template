import { createZTHTTP, HTTP } from './core'
import { getApiHost } from '../constants'

export let commonApi: HTTP

export const createCommonApi = () => {
  commonApi = createZTHTTP({
    baseUrl: getApiHost('common'),
    header: { 'Content-Type': 'application/json' }
  })
}
