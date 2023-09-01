import { createZTHTTP, HTTP } from './core'
import { getApiHost } from '../constants'

export let baseApi: HTTP

export const createBaseApi = () => {
  baseApi = createZTHTTP({
    baseUrl: getApiHost('base'),
    header: { 'Content-Type': 'application/json' }
  })
}
