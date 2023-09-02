import { createSXWYHTTP } from './core'
import { BASE_API } from '@/constants'

const baseApi = createSXWYHTTP({
  baseUrl: BASE_API,
  header: { 'Content-Type': 'application/json' }
})

export default baseApi
