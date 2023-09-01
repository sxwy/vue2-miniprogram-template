import { createZTHTTP, HTTP } from './core'
import { getApiHost } from '../constants'

export let publicApi: HTTP

export const createPublicApi = () => {
  publicApi = createZTHTTP({
    baseUrl: getApiHost('public'),
    header: { 'Content-Type': 'application/json' }
  })
}
