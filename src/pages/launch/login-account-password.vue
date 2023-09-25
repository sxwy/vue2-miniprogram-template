<template>
  <view>
    <u-navbar
      :fixed="false"
      :title="APP_NAME"
      :titleStyle="navbarTitleStyle"
      @leftClick="handleNavbarBackClick"
    />
    账密登录页
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
    }
  })
</script>

<style lang="scss" scoped></style>
