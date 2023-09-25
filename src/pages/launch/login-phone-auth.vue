<template>
  <view class="login-phone-auth">
    <u-navbar
      :leftIcon="null"
      :title="APP_NAME"
      :titleStyle="navbarTitleStyle"
    />
    <button
      class="btn"
      open-type="getPhoneNumber"
      plain
      :phone-number-no-quota-toast="false"
      @getphonenumber="handleLoginByWxPhoneAuth"
    >
      <text>授权登录</text>
    </button>
    <view class="type" @click="handleLoginTypeClick">其他登录方式</view>
  </view>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { APP_NAME } from '@/constants'
  import pageMixins from './mixins'

  export default Vue.extend({
    mixins: [pageMixins],
    data() {
      return {
        APP_NAME
      }
    },
    methods: {
      // 点击手机号授权登录按钮
      async handleLoginByWxPhoneAuth(
        payload: WechatMiniprogram.ButtonGetPhoneNumber
      ) {
        try {
          // 拒绝授权 || 获取手机号次数上限
          if (
            payload.detail.errMsg === 'getPhoneNumber:fail user deny' ||
            payload.detail.errMsg ===
              'getPhoneNumber:fail appid no enough quota'
          ) {
            this.handleLoginTypeClick()
            return
          }
          // 隐私协议不同意
          if (
            payload.detail.errMsg === 'privacy permission is not authorized'
          ) {
            return
          }
          const iv = payload.detail.iv
          const encryptedData = payload.detail.encryptedData
          const wxPhoneCode = payload.detail.code
          if (!iv && !encryptedData && !wxPhoneCode) {
            uni.showToast({
              icon: 'none',
              title: '获取手机号授权信息失败'
            })
            // report.error({
            //   EventID: 'getPhoneNumber',
            //   msg: '获取手机号授权信息失败',
            //   msgLocation: 'launch.login-phone-auth.handleLoginByWxPhoneAuth',
            //   parm: JSON.stringify({
            //     detail: payload.detail
            //   })
            // })
            return
          }
          uni.showLoading({ mask: true, title: '加载中...' })
          const ztSession = await new Promise((resolve) => {
            setTimeout(() => {
              resolve({})
            }, 3000)
          })
          if (ztSession) {
            uni.hideLoading()
            uni.reLaunch({
              url: this.handleGetRedirectPage()
            })
          } else {
            uni.hideLoading()
            this.handleLoginError()
          }
        } catch (error) {
          uni.hideLoading()
          this.handleLoginError(error)
        }
      },
      // 点击其他登录方式
      handleLoginTypeClick() {
        const pageQueryStr = (uni as any).$u.queryParams(this.pageQuery)
        uni.navigateTo({
          url: `/pages/launch/login-account-password${pageQueryStr}`
        })
      }
    }
  })
</script>

<style lang="scss" scoped>
  .login-phone-auth {
    .btn {
      width: 590rpx;
      height: 96rpx;
      line-height: 1;
      margin-top: 384rpx;
      border: none;
      border-radius: 49rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
      color: #fff;
      background-color: #4fc14d;
    }

    .type {
      margin-top: 54rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
      color: #ffd100;
    }
  }
</style>
