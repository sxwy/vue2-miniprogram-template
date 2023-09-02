import { LAUNCH_PAGE, LOGIN_HOME_PAGE } from '@/constants'
import store from '@/store'

let isInvalid = false

export const handleLoginInvalid = async (message = '登录失效，请重新登录') => {
  if (isInvalid) {
    return
  }
  isInvalid = true
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const currentRoute = `/${currentPage.route}`
  if (currentRoute === LAUNCH_PAGE || currentRoute === LOGIN_HOME_PAGE) {
    await store.dispatch('user/logout')
    isInvalid = false
  } else {
    uni.showModal({
      title: '提示',
      content: message,
      showCancel: false,
      success: async () => {
        await store.dispatch('user/logout', {
          url: LOGIN_HOME_PAGE,
          action: 'reLaunch'
        })
        isInvalid = false
      }
    })
  }
}
