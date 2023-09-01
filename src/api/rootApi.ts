import { createZTHTTP, HTTP } from './core'
import { getApiHost } from '../constants'

export let rootApi: HTTP

export const createRootApi = () => {
  rootApi = createZTHTTP({
    baseUrl: getApiHost('root'),
    header: { 'Content-Type': 'application/json' }
  })
}
