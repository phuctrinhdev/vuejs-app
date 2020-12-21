<template>
  <nav class="menu-pc">
    <div class="salon">
      <p class="local">{{ shop_data.shop_name }}</p>
      <p class="menu-pc-trigger" @click="onTriggerMenu">
        <span v-show="show_menu_pc.is_show">{{ $t('menu.toggle-hide-menu') }}</span>
        <span v-show="!show_menu_pc.is_show">{{ $t('menu.toggle-show-menu') }}</span>
      </p>
    </div>
    <div :class="{ show: show_menu_pc.is_show }" class="inner">
      <ul class="menu-list clearfix">
        <template v-for="menu in menu_data">
          <li :key="menu.index" :class="{ 'account-menu-mobile' : (menu.text == 'account') }">
            <router-link v-if="checkMenuRole(menu.code)" :to="menu.link">{{ $t('menu.' + menu.text) }}</router-link>
            <div v-show="menu_sub_show" 
                 :class="menu.text" class="menu-sub-wrap clearfix">
              <div v-for="menu_sub in menu.submenu" :key="menu_sub.index"
                   class="menu-sub" >
                <h2 v-if="menu_sub.text.length > 0 && checkMenuRole(menu_sub.code)">{{ $t('menu.' + menu_sub.text) }}</h2>
                <ul> 
                  <li v-for="menu_sub_sub in menu_sub.submenu" :key="menu_sub_sub.index" class="menu-sub-sub"
                      @click="onSetPageInfo(menu_sub_sub.link)">
                    <router-link v-if="checkMenuRole(menu_sub_sub.code)" :to="menu_sub_sub.link">
                      <span><i :class="menu_sub_sub.text"/></span>
                      <span>{{ $t('menu.' + menu_sub_sub.text) }}</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
import { options } from '../../../helpers/options'
import component_base from '../../common/component-base/component-base'
import { mapGetters, mapActions, mapMutations }   from 'vuex'
import _ from 'lodash'

export default {
  extends: component_base,
  data(){
    return {
      trigger_text: 'menu.toggle-hide-menu',
      menu_sub_show: true,
      is_check_from_role: false
    }
  },
  computed: {
    ...mapGetters('menu', {
      x_menu_pc: 'getMenuPc',
      menu_data: 'getMenu',
      show_menu_pc:'getShowMenuPc'
    }),
    ...mapGetters('user', {
      user_data: 'getUser',
      shop_data: 'getShop'
    }),
  },
  methods: {
    ...mapActions('menu', [
      'setShowMenuPcData'
    ]),
    ...mapMutations('setup_automatic_messaging', [
      'setSetupAutomaticMessagingInfo',
    ]),
    ...mapActions({
      boardPageFilter: 'board/setPageFilterData',
    }),
    onTriggerMenu: function() {
      let show_menu_pc = {
        is_show: !this.show_menu_pc.is_show
      }
      this.setShowMenuPcData(show_menu_pc)
    },
    checkMenuRole(code){
      if(this.x_menu_pc.data == undefined || _.isEmpty(this.x_menu_pc.data)) return true
      if(this.x_menu_pc.data.items.length>0) return _.includes(this.x_menu_pc.data.items, code)
      if(this.x_menu_pc.data.items.length==0) return false
      else return true
    },
    onSetPageInfo(link){
      if(link == options.boards_enum.link_type.sys_notice || link == options.boards_enum.link_type.sys_board){
        this.boardPageFilter({
          search_type : options.boards_enum.search_board_type.title,
          contents    : null,
          page_number : 1
        })
      }else if(link == options.messages_enums.link_type){
        this.setSetupAutomaticMessagingInfo({
          tab : options.messages_enums.setup_automatic_messaging_tab.booking,
        })
      }
    }
  }
}
</script>

<style lang='scss'>
@import './menu-pc.scss';
</style>