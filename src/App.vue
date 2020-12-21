<template>
  <div id="app" class="app">
    <div v-if="$route.name != popup_view && is_logged && $route.name != cid_popup_view"> 
      <header-block :key="'app-header-block'" @change-shop="onChangeShop"/>
    </div>
    <transition :duration="{ leave: 100, enter: 500 }" name="fade" mode="out-in" 
                appear>
      <router-view :key="key"/>
    </transition>

    <footer-block v-if="$route.name != popup_view && is_logged && $route.name != cid_popup_view" :key="'app-footer-block'"/>

    <pre-loader :key="'app-spinner'"/>
    <alert id="alert-modal" :key="'app-alert-modal'"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import pre_loader from './components/common/pre-loader/pre-loader.vue'
import header_block from './components/common/header-block/header-block.vue'
import footer_block from './components/common/footer-block/footer-block.vue'
import alert from './components/common/alert/alert.vue'
import { options }    from './helpers/options'
import component_base from './components/common/component-base/component-base'
import { cache_session } from './helpers/cache-session'
import { convertDateToTimezone,
  convertDateFromTimezoneToTimestamp } from './helpers/common'
import { guid } from './helpers/common'
import package_info from '../package.json'

export default {
  components: {
    'pre-loader': pre_loader,
    'header-block': header_block,
    'footer-block': footer_block,
    alert
  },
  extends: component_base,
  data() {
    return {
      options,

      table_filter: {
        page_size          : options.pagination.max,
        page_number        : 1,
        country_code       : null,
        solution_id        : 0,
        business_type_code : null,
        status             : options.common_status.active
      },

      popup_view: options.boards_enum.popup_view,
      cid_popup_view: options.cid_enum.cid_popup_view,
      key: 0
    }
  },
  computed:{
    ...mapGetters('user',[
      'getLoggedIn',
      'getUser'
    ]),
    is_logged() {
      return this.getLoggedIn
    }, 
  },
  created(){
    // view buildId
    document.title = `Ahasoft Salon-Admin (testing b${package_info.build_id})`

    // load app by shopId in cache_session
    let cache_shop_id = cache_session.getShopIdCache()
    this.setShopData(cache_shop_id)
  },
  mounted() {
    this.table_filter.country_code       = this.shop_data.country
    this.table_filter.business_type_code = this.shop_data.business_type_code
    this.table_filter.solution_id        = this.shop_data.solution_id
    this.table_filter.today_ts           = convertDateFromTimezoneToTimestamp(convertDateToTimezone(new Date()))
  },
  methods: {
    ...mapActions('user', [
      'setShopData'
    ]),
    onChangeShop(){
      this.key = guid()
    },
  }
}
</script>
