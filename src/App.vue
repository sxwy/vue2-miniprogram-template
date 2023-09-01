<script lang="ts">
  import Vue from 'vue'
  import { report } from '@/utils'

  let lastStarupTime = 0

  export default Vue.extend({
    mpType: 'app',
    async onLaunch(options) {
      lastStarupTime = Date.now()
      report.startup({
        status: '1',
        active_from: options?.scene || '',
        call_from: options?.path || ''
      })
    },
    // @ts-ignore
    onShow(options) {
      if (lastStarupTime > 0) {
        lastStarupTime = Date.now()
        report.startup({
          status: '2',
          active_from: options?.scene || '',
          call_from: options?.path || ''
        })
      }
    },
    onHide() {
      if (lastStarupTime > 0) {
        const options = uni.getEnterOptionsSync()
        report.startup({
          status: '0',
          stay_time: (Date.now() - lastStarupTime) / 1000,
          active_from: options?.scene || '',
          call_from: options?.path || ''
        })
      }
    }
  })
</script>

<style lang="scss">
  @import 'uview-ui/index.scss';
</style>
