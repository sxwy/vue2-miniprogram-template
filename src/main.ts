import Vue from 'vue'
import App from './App.vue'
import store from './store'
import uView from 'uview-ui'
import { navbar as navbarMixins } from '@/mixins'

Vue.config.productionTip = false

Vue.mixin(navbarMixins)

Vue.use(uView)

new App({ store }).$mount()
