<template>
  <main class="app-content">
    <section class="content sales-edit-delete-history">

      <!-- BEGIN TITLE --> 
      <div class="title">
        <h3>{{ $t('sales-edit-delete-history.title') }}</h3>
        <div class="link">
          <router-link :to="{ name: 'sales-edit-delete-history' }" class="active">{{ $t('sales-edit-delete-history.sales-edit-delete-history') }}</router-link>
          <router-link :to="{ name: 'balance-point-edit-history' }">{{ $t('sales-edit-delete-history.balance-points-edit-history') }}</router-link>
        </div>
      </div>

      <!-- BEGIN FILTER -->
      <div class="filter">
        <input-date-range ref="input_date_range" @input="onInputDate"/>
        <div class="user-id">
          <label>{{ $t('sales-edit-delete-history.user-id') }}</label>
          <b-form-select v-model="table_filter.user_id" 
                         :options="user_account_options" value-field="id" text-field="user_id"
                         @mouseleave.native="onMouseLeaveSelect">
            <template v-slot:first>
              <option :value="DEFAULT_GET_ALL_CLIENT">{{ $t('general.all') }}</option>
            </template>
          </b-form-select>
        </div>
        <div class="search">
          <button class="btn-submit" @click.prevent="onSearchAsync"><i class="btn-search-white"/> <span>{{ $t('sales-edit-delete-history.search') }}</span></button>
        </div>
      </div>

      <!-- BEGIN TABLE -->
      <div class="table">
        <p>{{ total_records_text }}</p>
        <view-table :data="table_data" @change-page="onChangePagesAsync">
          <template slot="date" slot-scope="{row}">
            {{ formatDate(row) }}
          </template>
          <template slot="client_name" slot-scope="{row}">
            <template v-if="row.client_id > 0">
              <span v-if="isClientOfCurrentShop(row)">
                {{ row.client_name }}
              </span>
              <span v-else :class="{ 'is-client-of-other-shop': !isClientOfCurrentShop(row) }">
                <div :id="'tooltip-client-name' + row.ref_id">
                  {{ row.client_name }}
                </div>
                <b-tooltip :target="'tooltip-client-name' + row.ref_id" placement="bottom">
                  {{ row.client_shop_name }}
                </b-tooltip>
              </span>
            </template>
            <template v-else>
              <span>
                {{ unregistered_client_text }}
              </span>
            </template>
          </template>
          <template slot="sales_items" slot-scope="{row}">
            <span v-if="row.ref_type == sales_options.sales_ref_type.refund" class="tag-refund">{{ $t('sales-invoice-tab.refund') }}<br></span>
            <span v-for="(item, index) in row.items" :key="index">
              {{ item.goods_name }}<br>
            </span>
          </template>
          <template slot="staff" slot-scope="{row}">
            <div :id="'staffs-' + row.ref_id" v-html="SalesUtils.formatStaffsOnSalesTable(row.items)"/>
            <b-tooltip v-if="SalesUtils.isStaffsCompact(row.items)" :target="'staffs-' + row.ref_id" placement="bottom">
              <div v-html="SalesUtils.formatStaffsOnSalesTable(row.items, true)"/>
            </b-tooltip>
          </template>
          <template slot="amount" slot-scope="{row}">
            <div v-html="SalesUtils.formatItemAmountOnSalesTable(row.items)"/>
          </template>
          <template slot="action" slot-scope="{row}">
            {{ getTypeNameOfArray(sales_options.sales_status_type,row.ref_status) }}
          </template>
          <template slot="created_by_name" slot-scope="{row}">
            {{ formatUserId(row) }}
          </template>
          <template slot="deleted_sales" slot-scope="{row}">
            <template v-if="row.ref_status == sales_options.sales_status.deleted || row.ref_status == sales_options.sales_status.edited">
              <a class="btn" @click="onViewRow(common_options.form_actions.view,row,sales_options.sales_status.deleted)">{{ $t('sales-edit-delete-history.view') }}</a>
            </template>
          </template>
          <template slot="new_sales" slot-scope="{row}">
            <template v-if="row.ref_status == sales_options.sales_status.edited">
              <a class="btn" @click="onViewRow(common_options.form_actions.view,row,sales_options.sales_status.edited)">{{ $t('sales-edit-delete-history.view') }}</a>
            </template>
          </template>
          
        </view-table>
      </div>

      <!-- MODAL -->
      <sales-detail :is_view_sales_edit_delete_history="true"/>
      <refund-detail/>
    </section>
  </main>
</template>

<script>
const DEFAULT_NUMBER_PAGE         = 1
const DEFAULT_GET_ALL_CLIENT      = -1

import { mapGetters, mapActions } from 'vuex'
import SalesApi                      from '../../../api/sales/sales-api.js'
import staff_mixin                   from '../../../helpers/mixins/staff-mixin'
import sales_mixin                   from '../../../helpers/mixins/sales-mixin'
import SalesUtils                    from '../../../helpers/utils/sales-utils.js'
import component_base                from '../../../components/common/component-base/component-base.vue'
import view_table                    from '../../../components/common/view-table/view-table.vue'
import input_date_range              from '../../../components/common/form/input/input-date-range/input-date-range.vue'
import sales_detail                  from '../../../components/sales/sales-detail/sales-detail.vue'
import refund_detail                 from '../../../components/sales/refund-detail/refund-detail'
import refund_mixin                  from '../../../helpers/mixins/refund-mixin'
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options.js'
import { sales_options }             from '../../../helpers/options/sales-options.js'
import { getTypeNameOfArray }        from '../../../helpers/common.js'
import moment                        from 'moment'

import {
  convertTimeStampToDate,
  formatMoney }                      from '../../../helpers/common.js'

export default {
  components : {
    'view-table'       : view_table,
    'input-date-range' : input_date_range,
    'sales-detail'     : sales_detail,
    'refund-detail'    : refund_detail
  },
  extends: component_base,
  mixins : [staff_mixin, sales_mixin, refund_mixin],
  data(){
    return {
      DEFAULT_GET_ALL_CLIENT,
      SalesUtils,
      sales_options,
      common_options,
      staff_options : [],

      sales_api     : new SalesApi(),

      total_records : 0,
      table_data    : {
        fields : [
          // {field: 'mobile',                     label: '',                                 width: 'auto',  thClass : 'mobile', expand: true, tdClass : 'mobile', column_expand : true},
          {field: 'date',           label: 'sales-edit-delete-history.date-time',       width: '10%',   sortable: false, expand: true},
          {field: 'client_name',    label: 'sales-edit-delete-history.clients',         width: '15%',   sortable: false, expand: true},
          {field: 'sales_items',    label: 'sales-edit-delete-history.sales-items',     width: '15%',   sortable: false, expand: true},
          {field: 'staff',          label: 'sales-edit-delete-history.staff',           width: '10%',   sortable: false, expand: true},
          {field: 'amount',         label: 'sales-edit-delete-history.amount',          width: '10%',   sortable: false, expand: true},
          {field: 'action',         label: 'sales-edit-delete-history.action',          width: '10%',   sortable: false, expand: true},
          {field: 'created_by_name',label: 'sales-edit-delete-history.user-id',         width: '10%',   sortable: false, expand: true},
          {field: 'deleted_sales',  label: 'sales-edit-delete-history.deleted-sales',   width: '10%',   sortable: false, expand: true},
          {field: 'new_sales',      label: 'sales-edit-delete-history.new-sales',       width: '10%',   sortable: false, expand: true}
        ],
        rows   : [],
        pagination : {},
        options : {
          pagination : true
        }
      },
      table_filter : {
        from_date        : {},
        to_date          : {},
        page_size        : common_options.pagination.default,
        page_number      : DEFAULT_NUMBER_PAGE,
        shop_id          : 0,
        user_id          : DEFAULT_GET_ALL_CLIENT
      },

      user_account_options: []
    }
  },
  computed: {
    ...mapGetters('user_account', {
      x_user_accounts: 'getUserAccounts'
    }),
    total_records_text(){
      let text = this.$i18n.t('sales-edit-delete-history.total-records')
      text = text.replace('{total_records}',formatMoney(this.total_records,0))
      return text 
    },
    unregistered_client_text(){
      return this.$i18n.t('sales-edit-delete-history.unregistered-client')
    }
  },
  async created(){
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.loadUserAccountsOptionsAsync()
  },
  async mounted(){ // not created because input_date_range need render first
    await this.loadDataTableAsync()
  },

  methods:{
    ...mapActions('user_account', [
      'getUserAccountsDataAsync'
    ]),

    // filter
    onInputDate(data){
      this.table_filter.from_date = data.value.from_date
      this.table_filter.to_date   = data.value.to_date
    },
    async loadUserAccountsOptionsAsync(){
      let query = {
        page_size           : options.pagination.max,
        page_number         : 1,
        status              : options.common_status.all,
        shop_id             : this.shop_data.shop_id,
        search_solution_name: null
      }
      await this.getUserAccountsDataAsync(query)

      if(this.x_user_accounts.is_ok){
        this.user_account_options = this.x_user_accounts.data.items
      }
      else this.showAlert(this.x_user_accounts.error_messages)
    },

    // table
    async loadDataTableAsync(){
      if(this.$refs.input_date_range.errors.length > 0){
        this.showAlert([...this.$refs.input_date_range.errors])
        return
      }

      this.preLoader()
      let response = await this.sales_api.getSalesHistoriesByCreateUserAsync(this.table_filter)
      this.preLoader(false)

      if (response.is_ok){
        this.table_data.rows       = response.data.items
        this.table_data.pagination = response.data.pagination
        this.total_records         = response.data.pagination.total_items
      }
      else{
        this.showAlertDialog(response.error_messages)
      }
    },
    isClientOfCurrentShop(row){
      return this.shop_data.shop_id == row.client_shop_id
    },
    async onChangePagesAsync(page){
      this.table_filter.page_number = page
      await this.loadDataTableAsync()
    },
    async onSearchAsync(){
      this.table_filter.page_number = DEFAULT_NUMBER_PAGE
      await this.loadDataTableAsync()
    },

    // action
    onViewRow(action, row, status){
      if(row.ref_type == sales_options.sales_ref_type.sales){
        this.onActionSalesMixin(action, row,status)
      }
      if(row.ref_type == sales_options.sales_ref_type.refund){
        let refund_action = {
          action: action,
          data: row
        }
        this.setRefundAction(refund_action)
        this.showDialogById('refund-detail-modal')
      }
    },

    formatDate(row){
      let tmp_date_time_ts = 0
      if(row.ref_status == sales_options.sales_status.edited) {
        tmp_date_time_ts = row.edited_date_time_ts
      } 
      if(row.ref_status == sales_options.sales_status.deleted) 
        tmp_date_time_ts = row.deleted_date_time_ts
      
      return moment(convertTimeStampToDate(tmp_date_time_ts,true)).format(common_options.standard_date_format.dmyh)
    },
    formatUserId(row){
      let text = ''
      if(row.ref_status == sales_options.sales_status.edited)  text = row.edited_by_name
      if(row.ref_status == sales_options.sales_status.deleted) text = row.deleted_by_name
      return text
    },

    moment,
    formatMoney,
    getTypeNameOfArray,
    convertTimeStampToDate
  }
}
</script>

<style lang="scss">
@import './sales-edit-delete-history.scss';
</style>
