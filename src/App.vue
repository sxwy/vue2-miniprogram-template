<script lang="ts">
  import Vue from 'vue'
  import { LAUNCH_PAGE } from '@/constants'

  export default Vue.extend({
    mpType: 'app',
    onLaunch(options) {
      console.log(
        '%c APP onLaunch==========>',
        'color: #4FC08D; font-weight: bold',
        options
      )
      // @ts-ignore
      this.handleNeedPrivacyAuthorization()
    },
    // @ts-ignore
    onShow(options) {
      console.log(
        '%c APP onShow==========>',
        'color: #4FC08D; font-weight: bold',
        options
      )
    },
    onHide() {
      console.log(
        '%c APP onHide==========>',
        'color: #4FC08D; font-weight: bold'
      )
    },
    // err 类型应该是 Error，uni-app 推断为 string，这边强制转为 any
    onError(err: any) {
      console.log('%c err==========>', 'color: #4FC08D; font-weight: bold', err)
      // report.error({
      //   msg: JSON.stringify({
      //     message: err.message,
      //     stack: err.stack
      //   }),
      //   msgLocation: 'onError'
      // })
    },
    onUnhandledRejection(options) {
      console.log(
        '%c options==========>',
        'color: #4FC08D; font-weight: bold',
        options
      )
      // const reason: string | Error = options.reason as any
      // report.error({
      //   msg:
      //     typeof reason === 'string'
      //       ? reason
      //       : JSON.stringify({
      //           message: reason.message,
      //           stack: reason.stack
      //         }),
      //   msgLocation: 'onPromiseError'
      // })
    },
    onPageNotFound(options) {
      console.log(
        '%c options==========>',
        'color: #4FC08D; font-weight: bold',
        options
      )
      // report.error({
      //   msg: JSON.stringify(options),
      //   msgLocation: 'onPageNotFound'
      // })
      uni.reLaunch({ url: LAUNCH_PAGE })
    },
    methods: {
      handleNeedPrivacyAuthorization() {
        // @ts-ignore
        if (uni.onNeedPrivacyAuthorization) {
          // @ts-ignore
          uni.onNeedPrivacyAuthorization((resolve, eventInfo) => {
            console.log('触发本次事件的接口是：', eventInfo)
            uni.navigateTo({
              url: '/pages/authorization/index'
            })
            uni.$once('authorization', (flag) => {
              console.log(
                '%c 监听到了==========>',
                'color: #4FC08D; font-weight: bold',
                flag
              )
              if (flag) {
                resolve({
                  buttonId: 'authorization-agree-btn',
                  event: 'agree'
                })
              } else {
                resolve({
                  event: 'disagree'
                })
              }
            })
          })
        }
      }
    }
  })
</script>

<style lang="scss">
  @import 'uview-ui/index.scss';
</style>
