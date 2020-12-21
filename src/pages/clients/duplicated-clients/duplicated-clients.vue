<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('menu.duplicated-clients') }}</h3>
        </article>
        <div class="section-search-part clearfix">
          <ul class="clearfix">
            <li class="part">
              <span class="badge badge-info badge-pill search-part">{{ $t('duplicated-clients.duplicated-by') }}</span> 
              <select v-model="table_filter.search_condition" class="custom-select">
                <option :value="options.clients_enums.duplicated_client_search_type.name_mobile">{{ $t('duplicated-clients.name-and-mobile-number') }}</option>
                <option :value="options.clients_enums.duplicated_client_search_type.name">{{ $t('general.name') }}</option>
                <option :value="options.clients_enums.duplicated_client_search_type.mobile">{{ $t('clients.mobile-number') }}</option>
              </select>
            </li>
          </ul>
          <div class="search-btn clearfix">
            <button class="submit-btn pc" @click="loadTableData"><span class="search-pc"/><span>{{ $t('general.search') }}</span></button>
            <button class="submit-btn mobile" @click="loadTableData"><span class="search-mobile"/></button>              
          </div>
        </div>

        <div class="section-part">         
          <div class="top-text clearfix mb10">
            <span class="fll">
              {{ $t('clients.all').replace('{0}', table_data.pagination.total_items) }}
            </span>
          </div>
          <div class="slide-x large">
            <clients-table :data="table_data" @change-page="onChangePage" @change-status="deleteClients">
              <template slot="client_name" slot-scope="{ row }">
                <span @click="onClientInfo(row)">
                  {{ (row.client_name) }}
                </span>
              </template>
              <template slot="mobile_phone" slot-scope="{ row }">
                <template v-if="row.phone_number != null && row.mobile_number != null">
                  {{ formatHideInfoCol(row.mobile_number, row.registration_date) }}
                  <br> / {{ formatHideInfoCol(row.phone_number, row.registration_date) }}
                </template>
                <template v-else-if="row.mobile_number != null">
                  {{ formatHideInfoCol(row.mobile_number, row.registration_date) }}
                </template>
                <template v-else-if="row.phone_number != null">
                  {{ formatHideInfoCol(row.phone_number, row.registration_date) }}
                </template>
              </template>
              <template v-if="is_show_button" slot="table-actions-bottom">
                <div class="btn-box bottom mt10">
                  <ul class="clearfix">
                    <li><clients-btn :data="{ label: 'duplicated-clients.delete-client' }" class="btn secondary" @click-action="onSendAction"/></li>
                  </ul>
                </div>
              </template>
            </clients-table>
          </div>
        </div>
      </div>
    </section> 
    <div class="common-style">
      <b-modal id="client-information-modal"             
               :title="'Client Information'"
               :no-close-on-backdrop="true"
               hide-footer
               size="llg"
               class="client-information-modal"
               @show="showInfoModal()">             
        <client-information ref="clientInformation" :client_id="client_info_id"/>
      </b-modal>
    </div>
  </main>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { formatMoney, formatDate, convertTimeStampToDate, getHideClientInfoPermission, hideMobilePhone } from '../../../helpers/common'
import ClientApi from '../../../api/clients/client-api'
import { options } from '../../../helpers/options'
import clients_table from '../../../components/clients/clients-table/clients-table.vue'
import { CLIENTS_ENUMS } from '../../../config/constant'
import clients_btn from '../../../components/common/button/common-btn/common-btn.vue'
import component_base    from '../../../components/common/component-base/component-base'
import client_information from '../../../components/clients/client-information/client-information.vue'
import ClientsCache                     from '../../../helpers/cache/clients-cache'
import _ from 'lodash'
import { sales_options }   from '../../../helpers/options/sales-options'

export default {
  components: {
    'clients-table': clients_table,
    'clients-btn': clients_btn,
    'client-information': client_information,
  },
  extends: component_base,
  data() {
    return {
      options,
      // table
      table_data: {
        fields: [
          { field: 'check',              label: 'checkbox',                        width: '4%',  sortable: false, thClass: this.showCheckCol, tdClass: this.showCheckCol  },
          { field: 'first_visit_date',   label: 'duplicated-clients.first-visit',  width: '16%', sortable: false, expand: false, formatFn: this.formatTimeStampToDate },
          { field: 'member_number',      label: 'clients.member-number',           width: '16%', sortable: false },
          { field: 'client_name',        label: 'clients.client-name',             width: '16%', sortable: false, expand: true },
          { field: 'mobile_phone',       label: 'clients.mobile-phone',            width: '16%', sortable: false, expand: true },
          { field: 'total_sales_amount', label: 'clients.total-sales',             width: '16%', sortable: false, expand: false, formatFn: this.formatMoneyCol },
          { field: 'recent_visit_date',  label: 'clients.recent-visit',            width: '16%', sortable: false, expand: false, formatFn: this.formatTimeStampToDate },
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: false,
          pagination: true
        },
        status_action: 0
      },
      table_filter: {
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0,
        search_condition: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE.NAME_MOBILE
      },
      clients_data: {},
      client_info_id: 0,

      clients_setup: {},
      clients_cache: new ClientsCache(),

      is_show_button: false
    }
  },
  created(){
    this.initClientSetup()
  },
  mounted() {
    this.table_filter.shop_id = this.shop_data.shop_id
    this.loadTableData()
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData',
    ]),
    ...mapMutations('sales',[
      'setClientIdUsingSales',
      'setClientShopIdUsingSales'
    ]),
    showCheckCol(){
      let class_name = 'hide'
      if(this.is_show_button) class_name = ''
      return class_name
    },
    async initClientSetup(){
      this.clients_setup = await this.clients_cache.getAllClientsSetupCache(this.shop_data.shop_id)
      if(this.isNullObject(this.clients_setup))
        this.showMissingClientsSetupAlert()
      else
      {
        if(this.x_user.user_role_code==options.user_roles.staff 
         && this.clients_setup.environments.allow_delete_client != sales_options.security_level_enum.staff_or_higher) this.is_show_button = false
        else if(this.x_user.user_role_code==options.user_roles.manager
         && this.clients_setup.environments.allow_delete_client == sales_options.security_level_enum.master) this.is_show_button = false
        else  this.is_show_button = true
      }
    },
    // table
    async loadTableData() {
      this.preLoader()

      let client_api = new ClientApi()
      let result = await client_api.getDuplicatedClientsAsync(this.table_filter)
      this.clients_data = Object.assign({}, result)
      
      if(this.clients_data.is_ok){
        this.table_data.rows = this.clients_data.data.items
        this.table_data.pagination = this.clients_data.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
      }
      else this.showAlert(this.clients_data.error_messages)

      this.preLoader(false)
    },
    // detect change watch() in child component 
    onSendAction(){
      this.table_data.status_action += 1
    },
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadTableData()
    },
    formatMoneyCol(number){
      return formatMoney(number, 2)
    },
    formatDateCol(date){
      return formatDate(date)
    },
    onClientInfo(row) {
      this.client_info_id = row.id
      this.setClientShopIdUsingSales(row.shop_id)
      this.$nextTick(function(){
        this.showDialogById('client-information-modal')
      })
    },
    showInfoModal(){
      this.$refs.clientInformation.onLoadForm()
    },
    async deleteClients(data){
      if(data.length > 0){
        let send_data = {
          client_ids: data,
          status: CLIENTS_ENUMS.CLIENT_STATUS.DELETED,
          session_token: this.x_user.session_token,
          shop_location: this.shop_data.shop_location,
          shop_id: this.shop_data.shop_id
        }
        let client_api = new ClientApi()
        let result = await client_api.updateClientStatusAsync(send_data)
        
        if(!result.is_ok) this.showAlert(result.error_messages)
        else {
          if(((this.table_filter.page_number - 1) * 10) == this.table_data.pagination.total_items - data.length)
            this.table_filter.page_number -= 1
          this.loadTableData()
        }
      }else{
        this.showAlert(new Array(this.$i18n.t('duplicated-clients.no-check-delete')))
      }
    },
    formatTimeStampToDate(ts) {
      if (ts == 0) return '' 
      return formatDate(convertTimeStampToDate(ts, true), this.shop_data.format_date)
    },
    formatHideInfoCol(mobile, registration_date){
      if(!_.isEmpty(this.clients_setup))
      {
        let isHideClientInfo = getHideClientInfoPermission(this.clients_setup.environments.contact_info_to_manager, this.clients_setup.environments.contact_info_to_staff, registration_date)
        if(isHideClientInfo) mobile=hideMobilePhone(mobile)
      }
      return mobile
    }
  }
}
</script>

<style lang='scss'>
@import './duplicated-clients.scss';
</style>