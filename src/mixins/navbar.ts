// @ts-nocheck

import store from '@/store'
import { LAUNCH_PAGE, BUSINESS_HOME_PAGE } from '@/constants'

export default {
  data() {
    return {
      /** 导航栏透明度 */
      navbarBgOpacity: 0
    }
  },
  computed: {
    /** 导航栏标题样式 */
    navbarTitleStyle() {
      return {
        fontSize: '34rpx',
        color: '#000'
      }
    },
    /** 导航栏标题样式 */
    navbarLeftIconSize() {
      return {
        fontSize: '34rpx',
        color: '#000'
      }
    },
    /** 导航栏左侧 icon 大小 */
    navbarLeftIconSize() {
      return '38rpx'
    },
    /** 导航栏左侧 icon 颜色 */
    navbarLeftIconColor() {
      return 'rgba(0, 0, 0, 0.9)'
    }
  },
  onPageScroll(result) {
    this.handleNavbarBgOpacity(result)
  },
  methods: {
    handleNavbarBackClick() {
      const pages = getCurrentPages()
      if (pages && pages.length > 1) {
        uni.navigateBack()
      } else {
        if (store.state.user.sxwySession) {
          uni.redirectTo({
            url: BUSINESS_HOME_PAGE
          })
        } else {
          uni.redirectTo({
            url: LAUNCH_PAGE
          })
        }
      }
    },
    handleNavbarBgOpacity(result) {
      if (result.scrollTop <= 20) {
        this.navbarBgOpacity = 0
      } else if (result.scrollTop <= 100) {
        this.navbarBgOpacity = result.scrollTop / 100
      } else {
        this.navbarBgOpacity = 1
      }
    }
  }
}
