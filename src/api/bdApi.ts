import { createZTHTTP, HTTP } from './core'
import { getApiHost } from '../constants'

export let bdApi: HTTP

export const createBdApi = () => {
  bdApi = createZTHTTP({
    baseUrl: getApiHost('bd'),
    header: { 'Content-Type': 'application/json' }
  })
}
