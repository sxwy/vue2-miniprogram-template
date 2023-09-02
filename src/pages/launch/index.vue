<template>
  <view class="launch">
    <u-navbar
      :leftIcon="null"
      :title="APP_NAME"
      :titleStyle="navbarTitleStyle"
    />
    <u-loading-icon vertical text="加载中..."></u-loading-icon>
  </view>
</template>

<script lang="ts">
  import Vue from 'vue'
  import store from '@/store'
  import { APP_NAME, LOGIN_HOME_PAGE } from '@/constants'
  import pageMixins from './mixins'

  export default Vue.extend({
    mixins: [pageMixins],
    data() {
      return {
        APP_NAME
      }
    },
    onLoad() {
      this.handlePageLoad()
    },
    methods: {
      async handlePageLoad() {
        try {
          const result = await store.dispatch('user/loginInit')
          if (result?.sxwySession) {
            uni.reLaunch({
              url: this.handleGetRedirectPage()
            })
          } else {
            const pageQueryStr = (uni as any).$u.queryParams(this.pageQuery)
            uni.reLaunch({
              url: `${LOGIN_HOME_PAGE}${pageQueryStr}`
            })
          }
        } catch (error) {
          console.log(
            '%c launch page error==========>',
            'color: #4FC08D; font-weight: bold',
            error
          )
          const pageQueryStr = (uni as any).$u.queryParams(this.pageQuery)
          uni.reLaunch({
            url: `${LOGIN_HOME_PAGE}${pageQueryStr}`
          })
        }
      }
    }
  })
</script>

<style lang="scss">
  page {
    height: 100%;
  }
</style>

<style lang="scss" scoped>
  .launch {
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
</style>
