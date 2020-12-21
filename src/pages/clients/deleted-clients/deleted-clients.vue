<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('menu.deleted-clients') }}</h3>
        </article>
        <div class="section-search-part clearfix">
          <ul class="clearfix">
            <li class="part">
              <input v-model="search_value" :placeholder="$t('deleted-clients.name-or-mobile-number')"
                     class="w-big" type="text" @keyup.enter="onSearch">
            </li>
          </ul>
          <div class="search-btn clearfix">
            <button class="submit-btn pc" @click="onSearch"><span class="search-pc"/><span> {{ $t('general.search') }}</span></button>
            <button class="submit-btn mobile"><span class="search-mobile"/></button>              
          </div>
        </div>
        <div class="section-part">         
          <div class="top-text clearfix mb10">
            <span class="fll">
              {{ $t('clients.all').replace('{0}', table_data.pagination.total_items) }}
            </span>
          </div>
          <div class="slide-x large">
            <clients-table :data="table_data" @change-page="onChangePage" @change-status="recoverClients"
                           @deleted-action="showDeleteAlert">
              <template slot="deleted_date" slot-scope="{ props }">
                {{ props.formattedRow.deleted_date }}
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
              <template slot="client_name" slot-scope="{ row }">
                <span @click="onClientInfo(row)">
                  {{ (row.client_name) }}
                </span>
              </template>
              <template slot="total_sales_amount" slot-scope="{ props }">
                {{ props.formattedRow.total_sales_amount }}
              </template>
              <template slot="recent_visit_date" slot-scope="{ props }">
                {{ props.formattedRow.recent_visit_date }}
              </template>
              <template v-if="is_show_button" slot="table-actions-bottom">
                <div class="btn-box bottom mt10">
                  <ul class="clearfix">
                    <li class="fll mr5">
                      <clients-btn :data="{ label: 'deleted-clients.recover-client' }" class="btn secondary" @click-action="onSendAction(1)"/>
                    </li>
                    <li class="fll">
                      <clients-btn :data="{ label: 'deleted-clients.delete-completely' }" class="btn secondary" @click-action="onSendAction(2)"/>
                    </li>
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
    <b-modal id="delete-alert"
             :title="'Client Information'"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm">
      {{ $t('deleted-clients.guide-text') }}
      <div class="modal-footer">
        <btn-action-group :data="form_options"
                          @confirm="deleteClients" @cancel="onCancel"/>
      </div>
    </b-modal>
  </main>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { formatMoney, formatDate, convertTimeStampToDate, hideMobilePhone, getHideClientInfoPermission, convertDateFromUtcToTimezone } from '../../../helpers/common'
import ClientApi from '../../../api/clients/client-api'
import { options } from '../../../helpers/options'
import clients_table from '../../../components/clients/clients-table/clients-table.vue'
import { CLIENTS_ENUMS } from '../../../config/constant'
import clients_btn from '../../../components/common/button/common-btn/common-btn.vue'
import client_information from '../../../components/clients/client-information/client-information.vue'
import btn_action_group from '../../../components/common/button/btn-action-group/btn-action-group'
import component_base    from '../../../components/common/component-base/component-base'
import ClientsCache                     from '../../../helpers/cache/clients-cache'
import _ from 'lodash'
import { sales_options }   from '../../../helpers/options/sales-options'

export default {
  components: {
    'clients-table': clients_table,
    'clients-btn': clients_btn,
    'client-information': client_information,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  data() {
    return {
      table_data: {
        fields: [
          { field: 'check',              label: 'checkbox',                     width: '4%',  sortable: false, thClass: this.showCheckCol, tdClass: this.showCheckCol  },
          { field: 'deleted_date',       label: 'deleted-clients.deleted-date', width: '16%', sortable: false, expand: true, formatFn: this.formatDateCol },
          { field: 'member_number',      label: 'clients.member-number',        width: '16%', sortable: false },
          { field: 'client_name',        label: 'clients.client-name',          width: '16%', sortable: false, expand: true },
          { field: 'mobile_phone',       label: 'clients.mobile-phone',         width: '16%', sortable: false, expand: true },
          { field: 'total_sales_amount', label: 'clients.total-sales',          width: '16%', sortable: false, expand: true, formatFn: this.formatMoneyCol },
          { field: 'recent_visit_date',  label: 'clients.recent-visit',         width: '16%', sortable: false, expand: true, formatFn: this.formatTimeStampToDate },
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: false,
          pagination: true
        },
        status_action: 0,
        delete_action: 0
      },
      table_filter: {
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0,
        search_value: ''
      },
      search_value: '',
      clients_data: {},
      client_info_id: 0,
      form_options: {
        delete: false
      },
      delete_data: {},

      clients_setup: {},
      clients_cache: new ClientsCache(),

      is_show_button: false,
    }
  },
  computed: {
    ...mapGetters('client_environment_setup', {
      client_environment_setup: 'getClientEnvironmentSetup'
    })
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
      let result = await client_api.getDeletedClientsAsync(this.table_filter)
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
    onSendAction(type){
      if(type == 1)
        this.table_data.status_action += 1
      else
        this.table_data.delete_action += 1
    },
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadTableData()
    },
    formatMoneyCol(number){
      return formatMoney(number, 2)
    },
    formatDateCol(date){
      return formatDate(convertDateFromUtcToTimezone(date, this.shop_data.timezone))
    },
    async recoverClients(data){
      if(data.length > 0){
        let send_data = {
          client_ids: data,
          status: CLIENTS_ENUMS.CLIENT_STATUS.ACTIVE,
          session_token: this.x_user.session_token,
          shop_location: this.shop_data.shop_location,
          shop_id: this.shop_data.shop_id
        }
        let client_api = new ClientApi()
        let result = await client_api.updateClientStatusAsync(send_data)

        this.actionResult(result, this.table_data.pagination.total_items - data.length)
      }else{
        this.showAlert(new Array(this.$i18n.t('clients.no-check-client')))
      }
    },
    showDeleteAlert(data){
      this.delete_data = data
      if(this.delete_data.length > 0)
        this.showDialogById('delete-alert')
      else
        this.showAlert(new Array(this.$i18n.t('clients.no-check-client')))
    },
    async deleteClients(){
      if(this.delete_data.length > 0){
        let send_data = {
          client_ids: this.delete_data,
          shop_id     : this.shop_data.shop_id,
          session_token: this.x_user.session_token,
          shop_location: this.shop_data.shop_location,
          country     : this.shop_data.country
        }
        let client_api = new ClientApi()
        let result = await client_api.deletedClientsAsync(send_data)

        this.actionResult(result, this.table_data.pagination.total_items - this.delete_data.length)

        this.hideDialogById('delete-alert')
      }
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
    onSearch(){
      this.table_filter.search_value = this.search_value
      this.onChangePage(1)
    },
    actionResult(result, length){
      if(!result.is_ok) this.showAlert(result.error_messages)
      else {
        if(((this.table_filter.page_number - 1) * 10) == length)
          this.table_filter.page_number -= 1
        this.loadTableData()
      }
    },
    onCancel(){
      this.hideDialogById('delete-alert')
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

<style lang="scss">
@import './deleted-clients.scss';
</style>