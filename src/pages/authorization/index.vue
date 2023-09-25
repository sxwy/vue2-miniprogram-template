<template>
  <view class="authorization">
    <u-popup
      mode="center"
      :round="30"
      :show="true"
      :closeOnClickOverlay="false"
      :safeAreaInsetBottom="false"
    >
      <view class="authorization__popupContent">
        <view class="authorization__popupContent__tittle">小程序温馨提示</view>
        <view class="authorization__popupContent__text">
          尊敬的用户，我们依据相关法律法规要求制定了<span
            class="authorization__popupContent__privacyContract"
            @click="handleOpenPrivacyContract"
            >《小程序隐私政策》</span
          >，来帮助您了解，我们如何收集，使用及存储您的个人信息和您的权利义务。
        </view>
        <view class="authorization__popupContent__text">
          请您在点击同意前仔细阅读充分理解相关内容，所有涉及权限均在隐私政策中声明；权限的获取是为了正常使用产品相关的功能，未经您同意，我们不会向第三方共享或提供您的信息。
        </view>
        <view class="authorization__popupContent__text">
          若您同意以上协议内容，请点击“同意并继续”开始使用我们的产品和服务；
        </view>
        <view class="authorization__btn">
          <button
            plain
            class="authorization__btn__disagree"
            @click="handleDisagree"
            >不同意</button
          >
          <button
            plain
            class="authorization__btn__agree"
            id="authorization-agree-btn"
            open-type="agreePrivacyAuthorization"
            @agreeprivacyauthorization="handleAgree"
            >同意并继续</button
          >
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    data() {
      return {
        /** 是否同意隐私授权 */
        isAgree: false,
        /** 是否按钮点击 */
        isBtnClick: false
      }
    },
    onUnload() {
      this.handleUnLoadBack()
    },
    methods: {
      handleAuthorizationEmit() {
        uni.$emit('authorization', this.isAgree)
      },
      handleAuthorizationByBeforeEmit() {
        uni.$emit('authorizationByBefore', this.isAgree)
      },
      handleGetDelta() {
        // eslint-disable-next-line no-undef
        // const pages = getCurrentPages()
        // if (pages[pages.length - 2]?.route === 'packages/sign/clock/index') {
        //   return 2
        // }
        return 1
      },
      handleBtnBack() {
        const delta = this.handleGetDelta()
        uni.navigateBack({
          delta: this.isAgree ? 1 : delta, // 只有不同意授权时，才需要 back 多层
          success: () => {
            // 因为有些 API 需要在页面展示完成后才会触发，如 chooseImage，所以需要把事件放在 back 回调中
            this.handleAuthorizationEmit()
          }
        })
      },
      handleUnLoadBack() {
        if (this.isBtnClick) {
          return
        }
        // 因为在 onUnLoad 执行 back，上一个页面的 onShow 还是会执行，所以需要对应的业务页面配合监听进行逻辑处理
        // 需要先触发授权事件给业务页面，然后对应的业务页面的 onShow 会执行对应的监听逻辑
        this.handleAuthorizationByBeforeEmit()
        const delta = this.handleGetDelta()
        const backDelta = delta - 1 // 返回的层级，需要减去 onUnLoad 执行的一个层级（因为本身 onUnLoad 的执行就会返回一次）
        // 只有当层级大于 1 的时候，才需要触发 back
        if (backDelta < 1) {
          this.handleAuthorizationEmit() // TODO 此处不确定执行时机，正常应该放在 back success 回调后触发，但是这边没有对应回调事件
          return
        }
        uni.navigateBack({
          delta: backDelta,
          success: () => {
            this.handleAuthorizationEmit()
          }
        })
      },
      handleAgree() {
        this.isBtnClick = true
        this.isAgree = true
        this.handleBtnBack()
      },
      handleDisagree() {
        this.isBtnClick = true
        this.isAgree = false
        this.handleBtnBack()
      },
      handleOpenPrivacyContract() {
        // 打开隐私协议页面
        // @ts-ignore
        uni.openPrivacyContract({
          success: () => {
            console.log(
              '%c 打开成功==========>',
              'color: #4FC08D; font-weight: bold'
            )
          },
          fail: () => {
            console.log(
              '%c 打开失败==========>',
              'color: #4FC08D; font-weight: bold'
            )
          }
        })
      }
    }
  })
</script>

<style lang="scss" scoped>
  .authorization {
    &__popupContent {
      box-sizing: border-box;
      width: 620rpx;
      color: #999;
      padding: 64rpx 48rpx;

      &__tittle {
        text-align: center;
        font-size: 34rpx;
        font-weight: 500;
        color: #000;
        margin-bottom: 36rpx;
      }

      &__text {
        text-indent: 2em;
        line-height: 46rpx;
      }

      &__privacyContract {
        color: #0af;
      }
    }

    &__btn {
      margin-top: 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 34rpx;
      font-weight: 500;

      &__disagree {
        color: #07c160;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        border: none;
        background: rgb(0 0 0 / 5%);
        border-radius: 8rpx;
        margin-right: 32rpx;
        padding: 0 66rpx;
      }

      &__agree {
        color: #fff;
        padding: 0 30rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        border: none;
        background: #04c160;
        border-radius: 8rpx;
      }
    }
  }
</style>
