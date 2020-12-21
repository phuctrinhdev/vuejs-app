<template>
  <dd class="user-account">
    <div class="user-account-pc">
      <div class="icon-user"/>
      <b-dropdown :text="user_name" class="user-account-dropdown">
        <b-dropdown-header v-if="account_menu_options.length>0" disabled >{{ $t('user-account.account') }}</b-dropdown-header>
        <b-dropdown-item v-for="account_menu_option in account_menu_options" :key="account_menu_option.index" :to="account_menu_option.link">
          {{ $t('menu.' + account_menu_option.text) }}
        </b-dropdown-item>
        <b-dropdown-header v-if="payment_menu_options.length>0" disabled>{{ $t('user-account.payment') }}</b-dropdown-header>
        <b-dropdown-item v-for="payment_menu_option in payment_menu_options" :key="payment_menu_option.index" :to="payment_menu_option.link">
          {{ $t('menu.' + payment_menu_option.text) }}
        </b-dropdown-item>
      </b-dropdown>
      <div class="user-auth">
        <b-btn v-b-modal.sign-out-modal>{{ $t('user-account.sign-out') }}</b-btn>
        <b-modal id="sign-out-modal"
                 :title="$t('user-account.sign-out')" :ok-title="$t('general.confirm')" :cancel-title="$t('general.cancel')"
                 :no-close-on-backdrop="true"
                 class="sign-out-modal"
                 size="sm" 
                 @ok.prevent="onLogout">
          <form>
            <div class="message">
              <article>
                <p>{{ $t('user-account.do-you-really-want-to-sign-out?') }}</p>
              </article>
            </div>
          </form>
        </b-modal>
      </div>
    </div>

    <div class="user-account-mobile profile">
      <div class="photo"/>
      <h3>{{ user_name }}</h3>
      <span>Ahashop Anyang</span>
      <span class="sign-out"><a href="#">{{ $t('user-account.sign-out') }}</a></span>
    </div>
  </dd>
</template>
<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  data(){
    return {
      user_name: '',
      account_menu_options:[],
      payment_menu_options:[]
    }
  },
  computed: {
    ...mapGetters('user', {
      user_data: 'getUser'
    }),
    ...mapGetters('menu', {
      x_menu_pc: 'getMenuPc',
      menu_data: 'getMenu'
    }),
  },
  watch: {
    'user_data.user_name'(){
      this.setData()
    },
    'x_menu_pc'(){
      this.resetMenu()
    }
  },
  beforeMount() {
    this.user_name = this.user_data.user_name
    this.account_menu_options= Object.values(this.menu_data.account.submenu.account.submenu)
    this.payment_menu_options= Object.values(this.menu_data.account.submenu.payment.submenu)
  },
  methods: {
    setData(){
      this.user_name = this.user_data.user_name
    },
    resetMenu(){
      const accountArray = Object.values(this.menu_data.account.submenu.account.submenu)
      const paymentArray = Object.values(this.menu_data.account.submenu.payment.submenu)
      if(this.x_menu_pc.data != undefined)
      {
        this.account_menu_options=[]
        this.payment_menu_options=[]
        for (var i = 0; i < paymentArray.length; i++) {
          if(_.includes(this.x_menu_pc.data.items, paymentArray[i].code))
          {
            this.payment_menu_options.push(paymentArray[i]) 
          }
        }
        for (var j = 0; j < accountArray.length; j++) {
          if(_.includes(this.x_menu_pc.data.items, accountArray[j].code))
          {
            this.account_menu_options.push(accountArray[j]) 
          }
        }
      }
      else 
      {
        this.account_menu_options= this.menu_data.account.submenu.account.submenu
        this.payment_menu_options= this.menu_data.account.submenu.payment.submenu
      }
    },
    onLogout(){
      this.$router.push({ name: 'logout' })
    }
  }
}
</script>

<style lang='scss'>
@import './user-account.scss';
</style>