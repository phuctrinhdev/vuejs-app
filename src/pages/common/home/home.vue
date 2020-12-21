<template>
  <main class="app-content">
    <section class="content home-page">
      <div class="inner">
        <article class="row row-sales">
          <ul class="clearfix">
            <sales-today :data="sales_today_data_view"/>
            <sales-today :data="booking_today_data_view"/>
            <sales-today :data="client_today_data_view"/>

            <!-- not apply -->
            <li class="sales-today marketing-balance">
              <h3>Start Communicating With Your Clients</h3>
              <a href="#!">TURN ON REMINDERS</a>
              <dl>
                <dt>YOUR MARKETING BALANCE</dt>
                <dd>10 SNS credits<br>
                  50 Booking Remindeers SNS credits<br> 
                  500 Email credits
                </dd> 
              </dl>
            </li>
          </ul>
        </article>

        <!-- Board Service -->
        <!-- Todo Check -->
        <article class="row row-info">
          <ul class="clearfix">
            <home-board :data="system_notice_data_view" @click="onSetBoardPage(options.boards_enum.board_type.sys_notice)"/>
            <home-board v-if="chain_id==0" :data="salon_qna_data_view" @click="onSetBoardPage(options.boards_enum.board_type.sys_board)"/>
            <home-board v-if="chain_id>0" :data="headquater_notice_data_view" @click="onSetBoardPage(options.boards_enum.board_type.chn_notice)"/>
            <home-board v-if="chain_id>0 && board_type != options.boards_enum.branch_board_type.none" :data="chain_board_data_view" @click="onSetBoardPage(options.boards_enum.board_type.chn_board)"/>            
          </ul>
        </article>
      </div>
    </section>
  </main>
</template>

<script>
import sales_today                    from '../../../components/common/sales-today/sales-today.vue'
import home_board                     from '../../../components/common/home-board/home-board.vue'
import component_base                 from '../../../components/common/component-base/component-base'
import HomepageApi                    from '../../../api/boards/homepage-api'
// import ShopEnvironmentApi             from '../../../api/account/shop-environment-api'
// import ShopEnvironmentSetupViewModel  from '../../../view-model/account/shop-environment-setup-view-model'
import { options }                    from '../../../helpers/options'
import { mapActions, mapGetters }     from 'vuex'
import _                              from 'lodash'
import { cookieAction,
  convertDateToTimezone,
  convertDateFromTimezoneToTimestamp,
  convertTimeStampPlusLocalzone,
  formatMoney, 
  convertDateToTimeStamp } from '../../../helpers/common'

export default {
  components: {
    'sales-today' : sales_today,
    'home-board'  : home_board
  },
  extends: component_base,
  data() {
    return {
      options: options,
      system_notice_data: null,
      salon_qna_data: null,
      chain_board_data: null,
      headquater_notice_data: null,
      chain_id:0,
      board_type: 0,
      //shop_environment_setup: [],
      from_login: false,
      error_messages: []
    }
  },
  computed: {
    // notice
    ...mapGetters('home', {
      sales_today_data: 'getSalesToday',
      booking_today_data: 'getBookingToday',
      client_today_data: 'getClientToday'
    }),
    ...mapGetters('shop', {
      shop_environment_data: 'getShopEnvironment'
    }),
    sales_today_data_view() {
      const sales_today_data_tmp = this.sales_today_data
      const tmp_data = {
        head_title: this.$i18n.t('home.sales-today'),
        end_title: this.$i18n.t('sales.net-sales-total'),
        total:
          sales_today_data_tmp.net_sales_total,
        items: [
          {
            text: this.$i18n.t('home.service'),
            value: sales_today_data_tmp.service
          },
          {
            text: this.$i18n.t('home.product'),
            value: sales_today_data_tmp.product
          },
          {
            text: this.$i18n.t('home.prepaid-card'),
            value: sales_today_data_tmp.prepaid_card
          },
          {
            text: this.$i18n.t('home.prepaid-service'),
            value: sales_today_data_tmp.prepaid_service
          },
          {
            text: this.$i18n.t('report.sales-total'),
            value: sales_today_data_tmp.sales_total
          },
          {
            text: this.$i18n.t('sales.refund'),
            value: sales_today_data_tmp.refund
          }
        ]
      }
      return tmp_data
    },
    booking_today_data_view() {
      const booking_today_data_tmp = this.booking_today_data
      const tmp_data = {
        head_title: this.$i18n.t('home.booking-today'),
        items: [
          {
            text: this.$i18n.t('home.total'),
            value: booking_today_data_tmp.total
          },
          {
            text: this.$i18n.t('home.canceled'),
            value: booking_today_data_tmp.canceles
          },
          {
            text: this.$i18n.t('home.no-show'),
            value: booking_today_data_tmp.no_show
          },
          {
            text: this.$i18n.t('home.upcoming-booking'),
            value: booking_today_data_tmp.upcoming_booking
          }
        ]
      }
      return tmp_data
    },
    client_today_data_view() {
      const client_today_data_tmp = this.client_today_data
      const tmp_data = {
        head_title: this.$i18n.t('home.client-today'),
        end_title: this.$i18n.t('home.total'),
        total:
          client_today_data_tmp.newClients +
          client_today_data_tmp.repeateClients +
          client_today_data_tmp.unregisterClients,
        items: [
          {
            text: this.$i18n.t('home.new'),
            value: client_today_data_tmp.new
          },
          {
            text: this.$i18n.t('home.repeat'),
            value: client_today_data_tmp.repeat
          },
          {
            text: this.$i18n.t('home.unregistered-client'),
            value: client_today_data_tmp.unregistered_client
          }
        ]
      }
      return tmp_data
    },
    system_notice_data_view() {
      const tmp_data = {
        head_title: this.$i18n.t('home.system-notice'),
        items: this.system_notice_data,
        board_code: options.boards_enum.board_type.sys_notice
      }
      return tmp_data
    },
    headquater_notice_data_view() {
      const tmp_data = {
        head_title: this.$i18n.t('home.headquarter-notice'),
        items: this.headquater_notice_data,
        board_code: options.boards_enum.board_type.chn_notice
      }
      return tmp_data
    },
    salon_qna_data_view() {
      const tmp_data = {
        head_title: this.$i18n.t('home.salon-qna'),
        items: this.salon_qna_data,
        board_code: options.boards_enum.board_type.sys_board
      }
      return tmp_data
    },
    chain_board_data_view() {
      const tmp_data = {
        head_title: this.$i18n.t('home.chain-board'),
        items: this.chain_board_data,
        board_code: options.boards_enum.board_type.chn_board
      }
      return tmp_data
    },
  },
  mounted() {
    // Delete comment for board api
    this.from_login = this.$route.params.from_login
    this.loadBoardData()
    this.chain_id=this.shop_data.chain_id
    this.board_type = this.shop_data.chain_board_type
    this.getShopEnvironmentSetupData()
    this.loadBoardOfSalesToday()
  },
  methods: {
    ...mapActions('home', [
      'getBoardOfSalesTodayAsync'
    ]),
    async getShopEnvironmentSetupData(){
      if(this.from_login){
        this.showNetmoneyAlert()
      }
    },
    showNetmoneyAlert(){
      if(this.shop_environment_data.data.fields.netmoney_alarm && (this.shop_environment_data.data.fields.netmoney_alarm_amount > this.shop_data.netmoney_balance))
      {
        this.alert_msg = this.$t('environment-setup.netmoney-alert-message') 
            + '<p/>' + this.$t('environment-setup.netmoney-current-balance') + `${formatMoney(this.shop_data.netmoney_balance, 0)}`
        this.showAlert([this.alert_msg])
      }
    },
    async loadBoardData() {

      // System Notice
      let table_filter = {
        shop_id            : this.shop_data.shop_id,
        solution_id        : this.shop_data.solution_id,
        business_type_code : this.shop_data.business_type_code,
        chain_id            : this.shop_data.chain_id,
        branch_type          : this.shop_data.branch_type,
        today_ts            : convertDateFromTimezoneToTimestamp(convertDateToTimezone(new Date())),
        country_code       : this.shop_data.country
      }

      this.preLoader()
      let homepage_api = new HomepageApi()
      let homepage_result = await homepage_api.getHompageBoardsAsync(table_filter)
      if(homepage_result.is_ok){
        this.system_notice_data = homepage_result.data.system_notices // If the board 
        this.salon_qna_data = homepage_result.data.system_boards
        this.chain_board_data = homepage_result.data.chain_boards
        this.headquater_notice_data = homepage_result.data.chain_notices
        let routeData = {}
        homepage_result.data.system_popups.forEach(popup => {
          if(!cookieAction(this, this.options.cookie_action.exist, 'popup_' + popup.popup_id)){
            routeData = this.$router.resolve({ name: 'popup-view', query: { id: popup.popup_id, country: this.shop_data.country, title:popup.title }})
            window.open(routeData.href, '_blank', ' left= ' + popup.left + ', top= ' + popup.top + ', width= ' + popup.width + ', height= ' + (popup.height + 40))
          }
        })
        homepage_result.data.chain_popups.forEach(popup => {
          if(!cookieAction(this, this.options.cookie_action.exist, 'popup_' + popup.popup_id)){
            routeData = this.$router.resolve({ name: 'popup-view', query: { id: popup.popup_id, country: this.shop_data.country, title:popup.title }})
            window.open(routeData.href, '_blank', 'left=' + popup.left + ', top= ' + popup.top + ', width= ' + popup.width + ', height=' + (popup.height + 40))
          }
        })
      }
      else this.error_messages.push(homepage_result.error_messages)
      this.preLoader(false)
    },
    async loadBoardOfSalesToday(){
      let date_setting = convertDateToTimezone(new Date())
      let from_date    = convertDateToTimeStamp(date_setting)
      let to_date      = convertDateToTimeStamp(_.cloneDeep(date_setting).setDate(date_setting.getDate() + 1)) - 1
      let current_time = convertDateToTimeStamp(date_setting, false, true)
      current_time = convertTimeStampPlusLocalzone(current_time)
      
      let data = {
        from_date: from_date,
        to_date: to_date,
        current_time: current_time,
        shop_id: this.shop_data.shop_id
      }
      let response = await this.getBoardOfSalesTodayAsync(data)
      if(!response.is_ok){
        this.showAlert(response.error_messages)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import "./home.scss";
</style>