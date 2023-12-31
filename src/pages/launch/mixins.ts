// @ts-nocheck

import { BUSINESS_HOME_PAGE } from '@/constants'

export interface PageQuery {
  /** 重定向页面 */
  page?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LoginQuery {}

export default {
  data() {
    return {
      /** 页面参数 */
      pageQuery: null as PageQuery | null,
      /** 登录参数 */
      loginQuery: null as LoginQuery | null
    }
  },
  onLoad(query: PageQuery) {
    this.handlePageQuery(query)
    this.handleLoginQuery()
  },
  methods: {
    handlePageQuery(query: PageQuery) {
      this.pageQuery = query
    },
    handleLoginQuery() {
      this.loginQuery = {}
    },
    handleGetRedirectPage() {
      if (this.pageQuery?.page && typeof this.pageQuery?.page === 'string') {
        return decodeURIComponent(this.pageQuery.page)
      }
      return BUSINESS_HOME_PAGE
    },
    handleLoginError(loginError?: any) {
      console.log(
        '%c loginError==========>',
        'color: #4FC08D; font-weight: bold',
        loginError
      )
      uni.showToast({
        icon: 'none',
        title: loginError?.message ? loginError.message : '登录失败'
      })
    }
  }
}
