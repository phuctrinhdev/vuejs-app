<template>
  <main class="app-content">
    <section class="content receivables-page">
      <!-- TITLE -->
      <div class="title">
        <h3>{{ $t('receivables.outstanding') }}</h3>
        <div>
          <router-link :to="{ name: 'outstanding-edit-history' }">{{ $t('receivables.outstanding-edit-history') }}</router-link>
        </div>
      </div>

      <!-- FILTER -->
      <div class="filter">
        <h3>{{ $t('receivables.outstanding') }}</h3>
        <div class="bigger-than">
          <label>{{ $t('receivables.bigger-than') }}</label>
          <input-money v-model="table_filter.min_outstanding_balance" 
                       :zero="false" :negative="true" 
                       @input="onChangeBiggerThan"/>
          <input v-model="table_filter.keyword" :placeholder="client_name_mobile_text" class="form-control">
        </div>
        <div class="search">
          <button class="btn-submit" @click.prevent="onSearchAsync"><i class="btn-search-white"/> <span>{{ $t('receivables.search') }}</span></button>
        </div>
      </div>

      <!-- TABLE -->
      <div class="table">
        <p>{{ all_client_total_amount_text }}</p>
        <view-table :data="table_data" @change-page="onChangePageAsync">
          <template slot="mobile_number" slot-scope="{row}">
            {{ formatHideInfoCol(row.mobile_number, row.registration_date) }}
          </template>
          <template slot="phone_number" slot-scope="{row}">
            {{ formatHideInfoCol(row.phone_number, row.registration_date) }}
          </template>
          <template slot="recent_visit" slot-scope="{row}">
            {{ formatRecentVisit(row) }}
          </template>
          <template slot="balance" slot-scope="{row}">
            {{ formatMoney(row.outstanding,0) }}
          </template>
          <template slot="payment" slot-scope="{row}">
            <a class="btn" @click="onOustandingPaymentAction(common_options.form_actions.add,row)">{{ $t('receivables.payment') }}</a>
          </template>
          <template slot="edit" slot-scope="{row}">
            <a class="btn" @click="onReceivablesEditingAction(common_options.form_actions.edit,row)">{{ $t('receivables.edit') }}</a>
          </template>
          <template slot="details" slot-scope="{row}">
            <a class="btn" @click="onReceivablesHistoryAction(common_options.form_actions.view,row)">{{ $t('receivables.details') }}</a>
          </template>
        </view-table>
      </div>
    </section>

    <!-- ACTION -->
    <outstanding-payment-action @added-outstanding="onHandleOutstandingAfterBeChange" />
    <outstanding-editing-action @edited-outstanding="onHandleOutstandingAfterBeChange"/>
    <outstanding-history/>
  </main>
</template>

<script>
const DEFAULT_NO_FILTER_KEYWORD = ''
const DEFAULT_NO_FILTER_BALANCE_BIGGER_THAN = 0
const DEFAULT_NUMBER_PAGE = 1

import Validator                  from '../../../view-model/validator.js'
import SalesClientAccountApi      from '../../../api/sales/sales-client-account-api.js'
import { common_options }         from '../../../helpers/options/common-options.js'
import view_table                 from '../../../components/common/view-table/view-table.vue'
import input_money                from '../../../components/common/form/input/input-money/input-money.vue'
import component_base             from '../../../components/common/component-base/component-base.vue'
import outstanding_payment_action from '../../../components/sales/outstanding-payment-action/outstanding-payment-action.vue'
import outstanding_editing_action from '../../../components/sales/outstanding-editing-action/outstanding-editing-action.vue'
import outstanding_history        from '../../../components/sales/outstanding-history/outstanding-history.vue'
import staff_mixin                from '../../../helpers/mixins/staff-mixin'
import { mapMutations, mapGetters } from 'vuex'
import moment                       from 'moment'
import ClientsCache               from '../../../helpers/cache/clients-cache'
import _ from 'lodash'
import { convertTimeStampToDate, 
  formatMoney,
  getHideClientInfoPermission,
  hideMobilePhone,
  convertTimeStampMinusLocalzone } from '../../../helpers/common.js'

export default {
  components : {
    'input-money'                : input_money,
    'view-table'                 : view_table,
    'outstanding-payment-action' : outstanding_payment_action,
    'outstanding-editing-action' : outstanding_editing_action,
    'outstanding-history'        : outstanding_history
  },
  extends : component_base,
  mixins:[staff_mixin],
  data(){
    return{
      moment,
      common_options,
      validator : {},
      total_clients : 0,
      total_amount  : 0,
      client_account_api : {},
      table_data : {
        fields : [
          // {field: 'mobile',                     label: '',                                 width: 'auto',  thClass : 'mobile', expand: true, tdClass : 'mobile', column_expand : true},
          {field: 'client_name',                label: 'receivables.clients',              width: '15%',   sortable: false},
          {field: 'mobile_number',              label: 'receivables.mobile-number',        width: '15%',   sortable: false, expand: true},
          {field: 'phone_number',               label: 'receivables.phone-number',         width: '15%',   sortable: false, expand: true},
          {field: 'recent_visit',               label: 'receivables.recent-visit',         width: '15%',   sortable: false, expand: true},
          {field: 'balance',                    label: 'receivables.outstanding-balance',  width: '10%',   sortable: false, expand: true},
          {field: 'payment',                    label: 'receivables.payment',              width: '10%',   sortable: false, expand: true},
          {field: 'edit',                       label: 'receivables.edit',                 width: '10%',   sortable: false, expand: true},
          {field: 'details',                    label: 'receivables.details',              width: '10%',   sortable: false, expand: true}
        ],
        rows : [],
        pagination : {},
        options : {
          pagination: true
        }
      },
      table_filter : {
        keyword                 : DEFAULT_NO_FILTER_KEYWORD,
        min_outstanding_balance : DEFAULT_NO_FILTER_BALANCE_BIGGER_THAN,
        page_size               : common_options.pagination.default,
        page_number             : DEFAULT_NUMBER_PAGE,
        shop_id                 : 0
      },

      clients_setup: {},
      clients_cache: new ClientsCache(),
    }
  },
  computed : {
    ...mapGetters('sales_client_account',{
      x_client_accounts : 'getClientAccounts'
    }),
    client_name_mobile_text(){
      return this.$i18n.t('receivables.client-name-or-mobile')
    },
    all_client_total_amount_text(){
      let text = this.$i18n.t('receivables.all-client-total-amount')
      text = text.replace('{total_client}',formatMoney(this.total_clients,0))
      text = text.replace('{total_amount}',formatMoney(this.total_amount,0))
      return text
    }
  },
  async created(){
    this.validator            = new Validator()
    this.client_account_api   = new SalesClientAccountApi()
    this.table_filter.shop_id = this.shop_data.shop_id

    this.preLoader()
    this.clients_setup = await this.clients_cache.getAllClientsSetupCache(this.shop_data.shop_id)
    if(this.isNullObject(this.clients_setup))
      this.showMissingClientsSetupAlert()
        
    await this.loadStaffOptions()
    await this.loadDataTableAsync()
    this.preLoader(false)
  },

  methods : {
    ...mapMutations('sales_client_account',[
      'setClientAccounts',
      'setClientAccountAction',
      'updateOutstandingByClientId'
    ]),
    ...mapMutations('staff',[
      'setStaffOptions',
    ]),
    formatMoney,
    convertTimeStampToDate,

    async loadStaffOptions(){
      let result = await this.getStaffsAsyncMixin()
      if(result.is_ok)
        this.setStaffOptions(result.data.items)
      else this.showAlert(result.error_messages)
    },
    async loadDataTableAsync(){
      let errors = this.isValidTableFilter()
      if(errors.length == 0){
        this.preLoader()
        let response = await this.client_account_api.getClientOutstandingsAsync(this.table_filter)
        this.preLoader(false)

        if(response.is_ok){
          this.setClientAccounts(response.data)
          this.total_clients = response.data.total_client
          this.total_amount  = response.data.total_amount
          this.table_data.rows = this.x_client_accounts.items
          this.table_data.pagination = this.x_client_accounts.pagination
        }
        else {
          this.showAlertDialog(response.error_messages)
        }
      }
      else{
        this.showAlertDialog(errors)
      }
    },
    async onSearchAsync(){
      this.table_filter.page_number = DEFAULT_NUMBER_PAGE
      await this.loadDataTableAsync()
    },
    async onChangePageAsync(page){
      this.table_filter.page_number = page
      await this.loadDataTableAsync()
    },

    async onHandleOutstandingAfterBeChange(client_info){
      let tmp_client = client_info.getFields()
      if(Number(tmp_client.outstanding) <= Number(this.table_filter.min_outstanding_balance)){
        this.table_filter.page_number = DEFAULT_NUMBER_PAGE
        await this.loadDataTableAsync()
      }
      else
        this.updateOutstandingByClientId(tmp_client)
    },

    onChangeBiggerThan(value){
      if(value != null || value != undefined){
        this.table_filter.min_outstanding_balance = value.length == 0 ? 
          DEFAULT_NO_FILTER_BALANCE_BIGGER_THAN : value
      }
    },
    onOustandingPaymentAction(action,item){
      this.setClientAccountAction({action : action, data : item })
      this.showDialogById('outstanding-payment-action-modal')
    },
    onReceivablesEditingAction(action,item){
      this.setClientAccountAction({action : action, data : item })
      this.showDialogById('edit-receivable-action-modal')
    },
    onReceivablesHistoryAction(action,item){
      this.setClientAccountAction({action : action, data : item })
      this.showDialogById('receivables-history-action-modal')
    },

    isValidTableFilter(){
      let messages = []
      let fields   = {
        keyword     : this.table_filter.keyword,
        outstanding : this.table_filter.min_outstanding_balance     
      }
      let validation_rules = {
        keyword : {
          label : 'receivables.client-name-or-mobile',
          rules : {
            maxLength   : {
              max_value : 500
            }
          }
        },
        outstanding : {
          label : 'receivables.bigger-than',
          rules : {
            maxLength   : {
              max_value : 12
            }
          }
        }
      }
      this.validator.setModel(fields)
      messages = this.validator.validate(validation_rules)
      return messages
    },

    // format
    formatRecentVisit(row){
      let tmp_date = convertTimeStampToDate(convertTimeStampMinusLocalzone(row.recent_visit))
      return moment(tmp_date).format(common_options.standard_date_format.ymdh)
    },
    formatHideInfoCol(mobile, registration_date){
      if(!_.isEmpty(this.clients_setup))
      {
        let isHideClientInfo = getHideClientInfoPermission(this.clients_setup.environments.contact_info_to_manager, this.clients_setup.environments.contact_info_to_staff, registration_date)
        if(isHideClientInfo) mobile= hideMobilePhone(mobile)
      }
      return mobile
    },
  }
}
</script>

<style lang="scss">
@import './outstanding.scss';
</style>
