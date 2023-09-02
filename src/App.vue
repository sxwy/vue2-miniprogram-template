<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    mpType: 'app',
    onLaunch(options) {
      console.log(
        '%c APP onLaunch==========>',
        'color: #4FC08D; font-weight: bold',
        options
      )
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
    }
  })
</script>

<style lang="scss">
  @import 'uview-ui/index.scss';
</style>
