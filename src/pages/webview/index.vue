<template>
  <web-view v-if="site" :src="site" />
</template>

<script lang="ts">
  import Vue from 'vue'

  interface PageQuery {
    /** 页面地址 */
    page?: string
    /** 页面地址 */
    url?: string
  }

  export default Vue.extend({
    data() {
      return {
        /** 页面参数 */
        pageQuery: null as PageQuery | null,
        /** 页面地址 */
        site: ''
      }
    },
    onLoad(query: PageQuery) {
      this.handlePageQuery(query)
      this.handleGetSite()
    },
    methods: {
      handlePageQuery(query: PageQuery) {
        query.page = decodeURIComponent(query.page || '')
        query.url = decodeURIComponent(query.url || '')
        this.pageQuery = query
      },
      handleGetSite() {
        this.site = this.pageQuery?.page || this.pageQuery?.url || ''
      }
    }
  })
</script>

<style lang="scss" scoped></style>
