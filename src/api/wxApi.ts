import { createZTHTTP, HTTP } from './core'
import { getApiHost } from '../constants'

export let wxApi: HTTP

export const createWxApi = () => {
  wxApi = createZTHTTP({
    baseUrl: getApiHost('wx'),
    header: { 'Content-Type': 'application/json' }
  })
}
