import { createZTHTTP, HTTP } from './core'
import { getApiHost } from '../constants'

export let albumApi: HTTP

export const createAlbumApi = () => {
  albumApi = createZTHTTP({
    baseUrl: getApiHost('album'),
    header: { 'Content-Type': 'application/json' }
  })
}
