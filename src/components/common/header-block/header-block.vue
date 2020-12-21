<template>
  <header class="header">
    <cid-block v-if="access_cid_block" ref="cid" :login_id="cid_login_id" 
               :login_pw="cid_login_password" :set_mac_address ="set_mac_address" style="position: absolute;"
               @result-login="resultLogin" 
               @close-caller="cancelToSendCall" />
    <div hidden>
      <input id="client_id" value="client_id" type="number">
      <input id="client_own_shop_id" value="client_own_shop_id" type="number">
      <input id="call_number" value="call_number" type="text">
      <input id="cid_id" value="cid_id" type="number">
      <input id="access_cid_block" value="access_cid_block" type="text">
      <b-button id="client-info" @click="showClientInfo()"/>
      <b-button id="add-client" @click="addClient()"/>
      <b-button id="close-popup" @click="closePopup()"/>
    </div>
    <div class="top-bar">
      <div class="inner">
        <div class="top-bar-left">
          <h1 class="logo">
            <router-link :to="{ name: 'home' }"/>
            <div class="extend-wrapper">
              <form class="change-shop-wrapper">
                <input id="txtShopId" v-model="shop_id" class="change-shop" 
                       disabled>
                       <!-- <button id="btnChangeShop" class="btn" @click.prevent="onChangeShop">Change Shop</button> -->
              </form>
            </div>
          </h1>
        </div>
        <dl class="btn-group clearfix">
          <dd>
            <router-link :to="{ name: 'sales' }" class="btn btn-link">{{ $t('header-block.sales') }}</router-link>
          </dd>
          <dd @click="onClickCalendar">
            <router-link :to="{ name: 'calendar' }" class="btn btn-link">{{ $t('header-block.calendar') }}</router-link>
          </dd>
        </dl>
        <div class="top-bar-right">
          <dl class="menu-user clearfix">
            <notification ref="notification" />
            <dd class="menu-user-home"><router-link :to="{ name: 'home' }"/></dd>
            <dd v-if="has_cid_setup">
              <span v-if="ktcid_loginyn" class="cid-connect-icon" style="cursor:pointer;"
                    @click="goToCidList()"/>
              <span v-if="!ktcid_loginyn" class="cid-disconnect-icon" style="cursor:pointer;"
                    @click="goToCidList()"/>
            </dd>
            <translate/>
            <user-account/> 
          </dl>
        </div>
      </div>
    </div>
    
    <menu-pc/>
    <menu-mobile/>
    <connect-client-modal v-if="show_blank" ref="add_client" :call_number="call_number" 
                          :cid_id = "cid_id"
                          @reload-page="showClientInfoAfterAddClient"/>
  </header>
</template>

<script>
import notification from '../notification/notification.vue'
import translate from '../translate/translate.vue'
import user_account from '../user-account/user-account.vue'
import menu_pc from '../menu-pc/menu-pc.vue'
import menu_mobile from '../menu-mobile/menu-mobile.vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import component_base from '../component-base/component-base'
import cid_block from './kt-cid.vue'
import ShopEnvironmentSetupViewModel            from '../../../view-model/account/shop-environment-setup-view-model'
import { equalObject }    from '../../../helpers/common'
import { 
  convertDateToTimezone,
} from '../../../helpers/common'
import { options } from '../../../helpers/options'
import connect_client_modal                      from  '../../../components/common/header-block/connect-client-modal.vue'
import CidReceivingHistory from '../../../api/cid/cid-receiving-history-api'

export default {
  components: {
    'notification': notification,
    'translate': translate,
    'user-account': user_account,
    'menu-mobile': menu_mobile,
    'menu-pc': menu_pc,
    'cid-block': cid_block,
    'connect-client-modal': connect_client_modal
  },
  extends: component_base,

  data(){
    return {
      shop_id: 1,
      token: '',
      alert_msg: '',
      get_shop_environment_setup: false,
      cid_login_id:'',
      cid_login_password: '',
      ktcid_loginyn: false,
      show_blank: false,
      popup: true,
      access_cid_block: false,
      set_mac_address: '',
      call_number: '',
      has_cid_setup: false
    }
  },
  computed: {
    ...mapGetters('user', {
      user_data: 'getUser'
    }),
    ...mapGetters('notification', { 
      x_token_booking: 'getTokenBooking'
    }),
    ...mapGetters('menu', {
      x_menu_pc: 'getMenuPc',
      // menu_data: 'getMenu',
      show_menu_pc:'getShowMenuPc'
    }),
    ...mapGetters('shop', {
      shop_environment_data: 'getShopEnvironment'
    })
  },
  created(){
    this.$root.$off('ktCid:findPassword')
    this.$root.$off('ktCid:login')
    this.$root.$off('ktCid:logout')
    this.$root.$off('ktCid:cidEnvironmenSetup')
    this.$root.$off('ktCid:sendCall')
    this.$root.$off('addClient:addClient')

    this.$root.$on('addClient:addClient', x=> this.addClient(x))
    this.$root.$on('ktCid:findPassword', this.findPassword)
    this.$root.$on('ktCid:login', x=> this.loginFromCidSetup(x))
    this.$root.$on('ktCid:logout', this.logoutKtCid)
    this.$root.$on('ktCid:cidEnvironmenSetup', this.cidEnvironmetSetup)
    this.$root.$on('ktCid:sendCall', x => this.sendCall(x))
    window.addEventListener('message', x => this.goToAddBookings(x))
  },

  mounted(){
    this.shop_id = this.shop_data.shop_id
    this.ktcid_loginyn=false
    this.get_shop_environment_setup=false
    this.getMenu(true)
    if(this.isCidBlock())
    {
      this.getShopEnvironmentData()
    } 
    else this.access_cid_block=false
    this.show_blank=false
  },
  methods: {
    ...mapActions('user', [
      'setUserData',
      'setShopData'
    ]),
    ...mapActions('booking', [
      'setDatePickerData',
    ]),
    ...mapActions('menu', [
      'setShowMenuPcData',
      'getUseMenuDataAsync',
      'setMenuPcData'
    ]),
    ...mapActions('shop', [
      'setShopEnvironmentDataAsync'
    ]),
    ...mapMutations('cid',[
      'setCidStatus'
    ]),
    ...mapMutations('sales',[
      'setClientIdUsingSales',
      'setClientShopIdUsingSales'
    ]),
    ...mapMutations('client', [
      'setBookingClient',
    ]),
    isCidBlock(){
      return !window.location.hash.includes('cid-receive-call-popup')
    },
    getShopEnvironmentData(){
      let send_data = {
        shop_id            : this.shop_data.shop_id,
        country_code       : this.shop_data.country
      }
      this.shop_environment_setup = new ShopEnvironmentSetupViewModel()
      this.preLoader()
      this.setShopEnvironmentDataAsync(send_data).then(() => {
        if(!this.shop_environment_data.is_ok){
          this.error_messages.push(this.shop_environment_data.error_messages)
          this.get_shop_environment_setup= false
        } 
        else
        {
          this.shop_environment_setup = this.shop_environment_data.data
          if(this.shop_environment_setup.fields.cid == null) this.has_cid_setup = false
          else this.has_cid_setup = true
          if(this.shop_environment_setup.fields.cid_accounts.length > 0)
          {
            for(let i in this.shop_environment_setup.fields.cid_accounts){
              let item = this.shop_environment_setup.fields.cid_accounts[i]
              if(equalObject(item.manager_id, this.user_data.user_name) 
              && item.status== options.cid_usage_status.active)
              {
                this.set_mac_address = item.mac_address
                this.cid_login_id=item.cid_login_id
                this.cid_login_password=item.cid_login_password
                if(this.shop_environment_setup.fields.cid=='KT'){
                  this.access_cid_block=true
                  this.loginKtCid()
                }
              }
            }
          }
        }
      })
      this.preLoader(false)
      this.get_shop_environment_setup= true
    },
    onClickCalendar(){
      let today = convertDateToTimezone(new Date())
      this.setDatePickerData(today)
    },
    findPassword(){
      this.$nextTick(() => {
        this.$refs.cid.findPassword()
      })
    },
    loginKtCid(){
      this.$nextTick(() => {
        this.$refs.cid.connec()
      })
    },
    logoutKtCid(){
      this.$nextTick(() => {
        this.$refs.cid.logout()
      })
    },
    cidEnvironmetSetup(){
      this.$nextTick(() => {
        this.$refs.cid.setMyInfo()
      })
    },
    loginFromCidSetup(login_info){
      this.cid_login_id=login_info.cid_login_id
      this.cid_login_password=login_info.cid_login_password
      this.loginKtCid()
    },
    resultLogin(login_yn)
    {
      this.ktcid_loginyn =login_yn
      this.setCidStatus(this.ktcid_loginyn)
    },
    // onChangeShop(){
    //   cache_session.clearAllSession()
    //   cache_session.setShopIdCache(this.shop_id)
    //   this.setShopData(this.shop_id)
    //   this.getMenu(true)
    //   this.$emit('change-shop')
    //   this.$refs.notification.setUpConnection()
    // },
    async getMenu(is_default){
      if(!is_default){
        let query = {
          country_code: this.shop_data.country, //'kr',
          service_type_code  : this.shop_data.service_type_code, //'SV_PRO', // toto
          business_type_code : this.shop_data.business_type_code, //'BS_HAI', // todo
          user_role_code     : this.user_data.user_role_code, //'STAFF',//this.user_data.user_role_code,
          shop_user_role_id  : 0,
          solution_id        : this.shop_data.solution_id, //3002//this.shop_data.solution_id
          chain_id           : this.shop_data.chain_id,
          chain_board_type   : this.shop_data.chain_board_type
        }
        this.preLoader(true)
        await this.getUseMenuDataAsync(query).then(() => {
          if(!this.x_menu_pc.is_ok) this.showAlert(this.x_menu_pc.error_messages)
          else{
            this.show_menu_pc.is_show = true
          } 
        })
        this.preLoader(false)
      }
    },
    sendCall(call_number){
      if(this.shop_data.phone_number == null || this.shop_data.phone_number == '') this.showAlert([this.$i18n.t('cid-send-call.no-shop-phone-number')])
      else this.$nextTick(() => {
        this.$refs.cid.sendCall(this.shop_data.phone_number, call_number)
      })
    },
    showClientInfo()
    {
      this.setClientShopIdUsingSales(document.getElementById('client_own_shop_id').value)
      this.setClientIdUsingSales(Number(document.getElementById('client_id').value))
      this.$router.push('/client-sales')
    },
    async updateClientId(client){
      let data_send={
        shop_id: this.shop_data.shop_id,
        cid_receiving_history_id: Number(document.getElementById('cid_id').value),
        client_id: client.id
      }
      let cid_receiving_history_api = new CidReceivingHistory()
      let result = await cid_receiving_history_api.UpdateCIDReceivingHistoryClientIdAsync(data_send)
      if(!result.is_ok) this.showAlert(result.error_messages)
    },
    showClientInfoAfterAddClient(client)
    {
      this.updateClientId(client)
      this.setClientShopIdUsingSales(client.shop_id)
      this.setClientIdUsingSales(client.id)
      this.$router.push('/client-sales')
    },
    addClient(new_phone_number=''){
      if(new_phone_number=='')
        this.call_number= document.getElementById('call_number').value
      else this.call_number = new_phone_number
      this.show_blank = true
      this.$nextTick(() => {
        this.$refs.add_client.addClient()
      })
    },
    cancelToSendCall(){
      this.$root.$emit('ktCid:closeCall')
    },
    goToCidList(){
      this.$router.push('/cid-history')
    },
    goToAddBookings(client_info){
      if(!window.location.hash.includes('cid-receive-call-popup') && client_info.data.is_from_cid_popup == true)
      {
        this.setBookingClient(client_info.data)
        this.$router.push('/calendar')
      }
    }
  },
}
</script>

<style lang='scss'>
@import './header-block.scss';
</style>
