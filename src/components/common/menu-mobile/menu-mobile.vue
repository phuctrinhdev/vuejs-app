<template>
  <div class="menu-mobile">
    <ul class="mobile-icon">
      <li><router-link :to="{ name: 'sales', params: { id: 123 }}"><i class="mobile-sales"/></router-link></li>
      <li><router-link :to="{ name: 'calendar' }"><i class="mobile-booking"/></router-link></li>
    </ul>
    
    <p class="menu-mobile-toggle" @click="onToggleMenuMobile"/>
    <nav :class="{ show: is_show }" class="menu-mobile-full">
      <div class="inner">
        <p class="btn-close" @click="onToggleMenuMobile"/>
        <h2 class="logo-transparent"><a href="#"/></h2>

        <user-account/>

        <div class="inner">
          <ul class="menu-list clearfix">
            <li v-for="menu in menu_data" :key="menu.index">
              <router-link :to="menu.link" @click="onToggleMenuMobile">
                <i :class="menu.text"/><span>{{ $t('menu.' + menu.text) }}</span>
              </router-link>
              <div :class="menu.text" class="menu-sub-wrap clearfix">
                <menu-sub v-for="menu_sub in menu.submenu" :key="menu_sub.index" :menu_sub="menu_sub"
                          @close-menu-mobile="onToggleMenuMobile"/>
              </div>
            </li>
          </ul>
        </div>

        <p class="copyright">{{ $t('general.copyright') }}</p>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import user_account from '../user-account/user-account.vue'
import menu_sub from './menu-sub.vue'

export default {
  components: {
    'user-account': user_account,
    'menu-sub': menu_sub
  },
  data() {
    return {
      is_show: false,
      is_expand: false
    }
  },
  computed: {
    ...mapGetters('menu', {
      menu_data: 'getMenu'
    })
  },
  methods: {
    onToggleMenuMobile(){
      this.is_show = !this.is_show
    }
  }
}
</script>

<style lang='scss'>
@import './menu-mobile.scss';
</style>