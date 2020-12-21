<template>
  <main class="app-content">
    <section class="contents-style cid-setup common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('cid-call-receive.cid-call-receive-history') }}</h3>
        </article>
        <div class="section-search-part clearfix">
          <ul class="clearfix">
            <li class="part">
              <span class="badge badge-info badge-pill search-part">{{ $t('cid-call-receive.date') }}</span>          
              <div class="dib">
                <div class="datepicker-dib">
                  <v-date-picker v-model="table_filter.registration_date_from" :popover="{ placement: 'bottom' }"
                                 :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"/> ~ 
                </div>
                <div class="datepicker-dib">
                  <v-date-picker v-model="table_filter.registration_date_to" :popover="{ placement: 'bottom' }"
                                 :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"/>
                </div>
              </div>
            </li>
            <li class="part">
              <span class="badge badge-info badge-pill search-part">{{ $t('cid-call-receive.call-number') }}</span> 
              <input v-model="table_filter.call_number" type="text" @keyup.enter="onSearch">
            </li>
          </ul>
          <div class="search-btn clearfix">
            <button class="submit-btn pc" @click="loadTableData"><span class="search-pc"/><span>{{ $t('general.search') }}</span></button>
            <button class="submit-btn mobile" @click="loadTableData"><span class="search-mobile"/></button>              
          </div>
        </div>
        <div class="section-search-part clearfix">
          <div class="top-text clearfix mb10 fz13"><span class="fll">
            <div v-html="$i18n.t('general.all-count').replace('{0}', table_data.pagination.total_items)"/>
          </span> <span class="flr color-red fz13">
            {{ $t('cid-call-receive.list-rule') }}
          </span></div>
          <div class="slide-x big">
            <view-table :data="table_data" @change-page="onChangePage">
              <template slot="call_number" slot-scope="{ row }">
                <div>
                  {{ row.call_number }}
                  <span v-if="checkisMobile(row.call_number)" class="message-w-icon" style="cursor:pointer;"
                        @click="onSendMessage(row)"/>
                  <span class="call-w-icon" style="cursor:pointer;"
                        @click="onSendCall(row.call_number)"/>
                </div>
              </template>
              <template slot="member_number" slot-scope="{ row }">
                <div>
                  <span v-if="row.member_number === null">0</span> 
                  <span v-else >{{ row.member_number }}</span>
                </div>
              </template>
              <template slot="client_name" slot-scope="{ row }">
                <div>
                  <span v-if="row.client_name === null" >{{ $t('cid-call-receive.unregistered') }} &nbsp;&nbsp;
                    <cid-receiving-history-btn :data="{ label: 'cid-call-receive.add-client', item: row }"
                                               @click-action="addClient(row)" />
                  </span> 
                  <span v-else @click="showClientInfo(row)" >{{ row.client_name }}</span>
                </div>
              </template>
              <template slot="bookings" slot-scope="{ row }">
                <cid-receiving-history-btn :data="{ label: 'cid-call-receive.bookings', item: row }"
                                           @click-action="onBookings(row)"/>
              </template>
              <template slot="sales" slot-scope="{ row }">
                <cid-receiving-history-btn :data="{ label: 'cid-call-receive.sales', item: row }" 
                                           @click-action="goToSales(row, false)"/>
              </template>
              <template slot="delete" slot-scope="{ row }">
                <cid-receiving-history-btn :data="{ label: 'general.delete', item: row }" 
                                           @click-action="onDeleteCidReceivingHistory(row)"/>
              </template>
            </view-table>
          </div>
        </div>
        <send-call-modal :call_number="call_number"/>
        <client-action v-if="action_visible" :root="root" @reload-page="goToSales" 
                       @hidden="action_visible=false" />
      </div>
    </section>
    <div v-if="info_visible" class="common-style">
      <b-modal id="client-information-modal"
               :title="client_information_title"
               :no-close-on-backdrop="true"
               hide-footer
               size="llg"
               class="client-information-modal"
               @show="showInfoModal()">
        <client-information ref="clientInformation" :client_id="client_info_id" />
      </b-modal>
    </div>
  </main>
</template>

<script>
import { setupCalendar, DatePicker }                from 'v-calendar'
import view_table                    from '../../../components/common/view-table/view-table'
import component_base                from '../../../components/common/component-base/component-base'
import { options }                   from '../../../helpers/options'
import { convertDateFromTimezoneToTimestamp, formatDateBySetting, convertDateFromUtcToTimezone  } from '../../../helpers/common'
import cid_receiving_history_btn from '../../../components/common/button/common-btn/common-btn'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import CidReceivingHistory from '../../../api/cid/cid-receiving-history-api'
import send_call_modal from '../../../components/common/header-block/cid-send-call-action.vue'
import client_action               from '../../../components/clients/client-action/client-action.vue'
import client_information          from '../../../components/clients/client-information/client-information.vue'
import ClientApi from '../../../api/clients/client-api'
import ClientViewModel from '../../../view-model/clients/client-view-model'
import { isMobile }               from '../../../helpers/common'

export default {
  components: {
    // pagination,
    'v-date-picker': DatePicker,
    'view-table'              : view_table,
    'cid-receiving-history-btn': cid_receiving_history_btn,
    'send-call-modal': send_call_modal,
    'client-action': client_action,
    'client-information': client_information
  },
  extends : component_base,
  data() {
    return {
      options : options,
      table_data: {
        fields: [
          { field: 'registration_date', label: 'cid-call-receive.date', width: '20%', sortable: false, expand: false, formatFn: this.formatDateCol },
          { field: 'call_number', label: 'cid-call-receive.call-number', width: '15%', sortable: false, expand: true },
          { field: 'member_number', label: 'cid-call-receive.client-number', width: '10%', sortable: false, expand: true },
          { field: 'client_name', label: 'cid-call-receive.client-name', width: '40%', sortable: false, expand: true },
          { field: 'bookings', label: 'cid-call-receive.bookings', width: '5%', sortable: false, expand: true },
          { field: 'sales', label: 'cid-call-receive.sales', width: '5%', sortable: false, expand: true},
          { field: 'delete', label: 'general.delete', width: '5%', sortable: false, expand: true }
        ],
        rows:[],
        pagination:{},
        options: {
          drag: false,
          pagination: true,
          clickable: false
        },
        total_count: 0
      },
      table_filter: {
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0, 
        registration_date_from: null,
        registration_date_to: null,
        call_number: ''
      },
      call_number:'',
      action_visible: false,
      root: 'cid-history',
      info_visible: false,
      client_information_title: '',
      client_info_id: 0,
      add_client_cid_receiving_history_id: 0,

      client_api: new ClientApi(),
    }
  },
  computed: {
    ...mapGetters('cid_receving_history', {
      search_receiving_histories_data: 'getCidReceivingHistories',
    }),
    
  },
  beforeMount(){
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db'
    })
  },
  mounted(){
    this.action_visible=false
    this.loadTableData()
  },
  methods: {
    ...mapActions('client', [
      'setClientActionDataAsync'
    ]),
    ...mapActions('cid_receving_history', [
      'getCidReceivingHistoriesDataAsync',
      'setCidReceivingHistoryActionDataAsync'
    ]),
    ...mapMutations('sales',[
      'setClientIdUsingSales',
      'setClientShopIdUsingSales'
    ]),
    ...mapMutations('client', [
      'setBookingClient',
    ]),
    async loadTableData() {
      this.preLoader()
      this.table_filter.shop_id = this.shop_data.shop_id
      let query = Object.assign({}, this.table_filter)    
      if (this.table_filter.registration_date_from !=null) {
        query.registrationDateFromTS = convertDateFromTimezoneToTimestamp(query.registration_date_from )
      }
      if (this.table_filter.registration_date_to !=null) {
        query.registrationDateToTS= convertDateFromTimezoneToTimestamp(query.registration_date_to) 
      }
      await this.getCidReceivingHistoriesDataAsync(query)
      if(this.search_receiving_histories_data.is_ok){
        this.table_data.rows = this.search_receiving_histories_data.data.items
        this.table_data.pagination = this.search_receiving_histories_data.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
      }
      else this.showAlert(this.search_receiving_histories_data.error_messages)

      this.preLoader(false)
    },
    onSearch(){
      this.onChangePage(1)
    },
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadTableData()
    },
    onSendCall(phone_number){
      this.call_number = phone_number
      this.$nextTick(() => {
        this.showDialogById('cid-send-call-modal')
      })
    },
    async onDeleteCidReceivingHistory(row)
    {
      let send_data = {
        shop_id: this.shop_data.shop_id,
        cid_receiving_history_id: row.cid_receiving_history_id
      }
      let cid_receiving_history_api = new CidReceivingHistory()
      let result = await cid_receiving_history_api.deleteCidHistoryAsync(send_data)
      
      if(!result.is_ok)
      {
        this.showAlert(result.error_messages)
      } 
      else {
        if(((this.table_filter.page_number - 1) * 10) == this.table_data.pagination.total_items - 1)
        {
          this.table_filter.page_number -= 1
        }
        this.loadTableData()
      }
    },
    onBookings(client){
      if(client.client_id != null || client.client_id > 0) this.getClient(client.client_id)
      else {
        if(isMobile(client.call_number)){
          let client_info = new ClientViewModel().fields
          client_info.mobile_number = client.call_number
          this.setBookingClient(client_info)
        }
      }
      this.$router.push('/calendar')
    },
    async getClient(client_id){
      let client_query = {
        client_id: client_id,
        shop_id: this.shop_data.shop_id
      }
      let response = await this.client_api.getClientAsync(client_query)
      if(response.is_ok){
        this.setBookingClient(response.data)
      }
      else this.showAlert(response.error_messages)
    },
    async updateClientId(client){
      let data_send={
        shop_id: this.shop_data.shop_id,
        cid_receiving_history_id: this.add_client_cid_receiving_history_id,
        client_id: client.id
      }
      let cid_receiving_history_api = new CidReceivingHistory()
      let result = await cid_receiving_history_api.UpdateCIDReceivingHistoryClientIdAsync(data_send)
      if(!result.is_ok) this.showAlert(result.error_messages)
    },
    goToSales(client, update_client=true)
    {
      if(update_client)  this.updateClientId(client)
      var client_shop_id = 0
      var client_id = 0
      if(client.client_own_shop_id == undefined)
      {
        client_shop_id = client.shop_id
        client_id = client.id
      } 
      else
      {
        client_shop_id = client.client_own_shop_id
        client_id = client.client_id
      } 
      if(client_id != null && (!this.shop_data.chain_sharing_settings.share_client && client_shop_id != this.shop_data.shop_id))
      {
        this.showAlert([this.$i18n.t('cid-history.not-available-access')])
      }
      else{
        this.setClientShopIdUsingSales(client_shop_id)
        this.setClientIdUsingSales(client_id)
        this.$router.push('/client-sales')
        
      }
      this.action_visible=false
    },
    formatDateCol(date){
      return formatDateBySetting(convertDateFromUtcToTimezone(date, this.shop_data.timezone), true)    
    },
    checkAccess(row)
    {
      if(!this.shop_data.chain_sharing_settings.share_client && row.client_own_shop_id != this.shop_data.shop_id)
        return false
      else return true
    },
    addClient(row)
    {
      this.add_client_cid_receiving_history_id= row.cid_receiving_history_id
      this.action_visible=true
      var unregistered_call_number = row.call_number
      var is_mobile = false
      if(isMobile(unregistered_call_number))
        is_mobile = true
      let client_action = {
        action: options.cid_enum.cid_client_action,
        call_number : unregistered_call_number,
        is_mobile: is_mobile
          
      }
      this.setClientActionDataAsync(client_action).then(() => {
        this.showDialogById('action-client-modal')
      })
    },
    showClientInfo(row){
      if(row.client_own_shop_id != this.shop_data.shop_id && !this.shop_data.chain_sharing_settings.share_client)
        this.showAlert([this.$i18n.t('cid-history.not-available-access')])
      else{
        this.info_visible = true
        this.client_info_id = row.client_id
        this.setClientShopIdUsingSales(row.client_own_shop_id)
        this.$nextTick(function(){
          this.showDialogById('client-information-modal')
        })
      }
    },
    showInfoModal(){
      this.client_information_title = this.$i18n.t('client-information.title')
      this.$refs.clientInformation.onLoadForm()
    },
    onSendMessage(row){
      if(row.client_id != null)
        this.$router.push({ name: 'send-messages', params: { type: options.messages_enums.send_page.client, client_id: row.client_id }})
      else
        this.$router.push({ name: 'send-messages', params: { type: options.messages_enums.send_page.cid_unregister_client, call_number: row.call_number }})
    },
    checkisMobile(phone_number){
      return isMobile(phone_number)
    }
  }
}
</script>

<style lang='scss'>
@import './cid-history.scss';
</style>