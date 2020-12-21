<template>
  <main class="app-content">
    <section class="content balance-point-edit-history">
      <!-- BEGIN TITLE --> 
      <div class="title">
        <h3>{{ $t('balance-point-edit-history.edit-and-delete-history') }}</h3>
        <div class="link">
          <router-link :to="{ name: 'sales-edit-delete-history' }">{{ $t('balance-point-edit-history.sales-edit-delete-history') }}</router-link>
          <router-link :to="{ name: 'balance-point-edit-history' }" class="active">{{ $t('balance-point-edit-history.balance-points-edit-history') }}</router-link>
        </div>
      </div>
      <!-- END TITLE -->
      <!-- BEGIN FILTER -->
      <div class="filter">
        <input-date-range ref="input_date_range" @input="onInputDate"/>
        <div class="edited-item">
          <label>{{ $t('balance-point-edit-history.edited-item') }}</label>
          <b-form-select v-model="table_filter.edited_item_type" :options="edited_item_options" @mouseleave.native="onMouseLeaveSelect"/>
        </div>
        <div class="user-id">
          <label>{{ $t('balance-point-edit-history.user-id') }}</label>
          <b-form-select v-model="table_filter.user_id" 
                         :options="user_account_options" value-field="id" text-field="user_id"
                         @mouseleave.native="onMouseLeaveSelect">
            <template v-slot:first>
              <option :value="DEFAULT_GET_ALL_CLIENT">{{ $t('general.all') }}</option>
            </template>
          </b-form-select>
        </div>
        <div class="search">
          <button class="btn-submit" @click.prevent="onSearchAsync"><i class="btn-search-white"/> <span>{{ $t('balance-point-edit-history.search') }}</span></button>
        </div>
      </div>
      <!-- END FILTER -->
      <!-- BEGIN TABLE -->
      <div class="table">
        <p>{{ total_records_text }}</p>
        <view-table :data="table_data" @change-page="onChangePagesAsync">
          <template slot="date" slot-scope="{row}">
            {{ moment(convertTimeStampToDate(row.registration_date_ts,true)).format(common_options.standard_date_format.dmyh) }}
          </template>
          <template slot="edited_item" slot-scope="{row}">
            <span v-html="formatEditedItem(row)"/>
          </template>
          <template slot="old_value" slot-scope="{row}">
            {{ formatOldOrNewValue(row.history_type,row.old_value) }}
          </template>
          <template slot="new_value" slot-scope="{row}">
            {{ formatOldOrNewValue(row.history_type,row.new_value) }}
          </template>
          <template slot="notes" slot-scope="{row}">
            {{ formatNotes(row) }}
          </template>
        </view-table>
      </div>
      <!-- END TABLE -->
    </section>
  </main>
</template>

<script>
const DEFAULT_NUMBER_PAGE    = 1
const DEFAULT_GET_ALL_STAFF  = -1
const DEFAULT_GET_ALL_TYPE   = 0
const DEFAULT_GET_ALL_CLIENT = -1

import { mapGetters, mapActions } from 'vuex'
import _                             from 'lodash'
import moment                        from 'moment'
import staff_mixin                   from '../../../helpers/mixins/staff-mixin'
import BalancePointsEditHistoryApi   from '../../../api/sales/balance-points-edit-history-api'
import SalesUtils                    from '../../../helpers/utils/sales-utils.js'
import component_base                from '../../../components/common/component-base/component-base.vue'
import view_table                    from '../../../components/common/view-table/view-table.vue'
import input_date_range              from '../../../components/common/form/input/input-date-range/input-date-range.vue'
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options.js'
import { sales_options }             from '../../../helpers/options/sales-options.js'

import { convertTimeStampToDate,
  formatMoney }                      from '../../../helpers/common.js'

export default {
  components : {
    'view-table'       : view_table,
    'input-date-range' : input_date_range
  },
  extends : component_base,
  mixins : [staff_mixin],
  data(){
    return {
      DEFAULT_GET_ALL_CLIENT,
      SalesUtils,
      sales_options,
      common_options,

      total_records    : 0,
      balance_points_edit_history_api : new BalancePointsEditHistoryApi(),
      table_data   : {
        fields : [
          {field: 'date',             label: 'balance-point-edit-history.date',               width: '10%',   sortable: false, expand: true},
          {field: 'client_name',      label: 'balance-point-edit-history.clients',            width: '15%',   sortable: false},
          {field: 'edited_item',      label: 'balance-point-edit-history.edited-item',        width: '15%',   sortable: false, expand: true},
          {field: 'old_value',        label: 'balance-point-edit-history.old-value',          width: '10%',   sortable: false, expand: true},
          {field: 'new_value',        label: 'balance-point-edit-history.new-value',          width: '10%',   sortable: false, expand: true},
          {field: 'created_by_name',  label: 'balance-point-edit-history.user-id',            width: '20%',   sortable: false},
          {field: 'notes',            label: 'general.notes',                                 width: '20%',   sortable: false, expand: true}
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
        edited_item_type : DEFAULT_GET_ALL_TYPE,
        user_id          : DEFAULT_GET_ALL_STAFF,
        client_id        : DEFAULT_GET_ALL_CLIENT,
        shop_id          : 0
      },

      user_account_options: []
    }
  },
  computed : {
    ...mapGetters('user_account', {
      x_user_accounts: 'getUserAccounts'
    }),
    edited_item_options(){
      return [
        { value :  sales_options.balance_point_edit_history_search_type.all                         , text : this.$i18n.t('balance-point-edit-history.all')},
        { value :  sales_options.balance_point_edit_history_search_type.prepaid_card_balance        , text : this.$i18n.t('balance-point-edit-history.prepaid-card-balance')},
        { value :  sales_options.balance_point_edit_history_search_type.prepaid_card_expire_date    , text : this.$i18n.t('balance-point-edit-history.prepaid-card-expire-date')},
        { value :  sales_options.balance_point_edit_history_search_type.prepaid_service_quantity    , text : this.$i18n.t('balance-point-edit-history.prepaid-service-quantity')},
        { value :  sales_options.balance_point_edit_history_search_type.prepaid_service_expire_date , text : this.$i18n.t('balance-point-edit-history.prepaid-service-expire-date')},
        { value :  sales_options.balance_point_edit_history_search_type.loyalty_point               , text : this.$i18n.t('balance-point-edit-history.loyalty-point')},
      ]
    },
    balance_point_edit_history_type_text(){
      return [
        { value :  sales_options.balance_point_edit_history_type_enum.card_balance        , text : this.$i18n.t('balance-point-edit-history.prepaid-card-balance')},
        { value :  sales_options.balance_point_edit_history_type_enum.card_expire_date    , text : this.$i18n.t('balance-point-edit-history.prepaid-card-expire-date')},
        { value :  sales_options.balance_point_edit_history_type_enum.service_quantity    , text : this.$i18n.t('balance-point-edit-history.prepaid-service-quantity')},
        { value :  sales_options.balance_point_edit_history_type_enum.service_expire_date , text : this.$i18n.t('balance-point-edit-history.prepaid-service-expire-date')},
        { value :  sales_options.balance_point_edit_history_type_enum.client_point        , text : this.$i18n.t('balance-point-edit-history.loyalty-point')},
        { value :  sales_options.balance_point_edit_history_type_enum.family_point        , text : this.$i18n.t('balance-point-edit-history.loyalty-point')}
      ]
    },
    total_records_text(){
      let text = this.$i18n.t('balance-point-edit-history.total-records')
      text = text.replace('{total_records}',formatMoney(this.total_records,0))
      return text 
    },
    from_family_point_text(){return this.$i18n.t('balance-point-edit-history.from-family')},
    to_family_point_text(){return this.$i18n.t('balance-point-edit-history.to-family')},
    change_family_point_text(){return this.$i18n.t('balance-point-edit-history.family')},
    from_family_notes_text(){return this.$i18n.t('balance-point-edit-history.from-family-notes')},
    to_family_notes_text(){return this.$i18n.t('balance-point-edit-history.to-family-notes')},
    change_family_notes_text(){return this.$i18n.t('balance-point-edit-history.change-family-notes')},
  },
  async created(){
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.loadUserAccountsOptionsAsync()
  },
  async mounted(){
    await this.loadDataTableAsync()
  },

  methods:{
    ...mapActions('user_account', [
      'getUserAccountsDataAsync'
    ]),

    moment,
    formatMoney,
    convertTimeStampToDate,

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
    async loadDataTableAsync(){
      if(this.$refs.input_date_range.errors.length > 0){
        this.showAlert([...this.$refs.input_date_range.errors])
        return
      }

      this.preLoader()
      let response = await this.balance_points_edit_history_api.getBalancePointEditHistoriesAsync(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        this.table_data.rows       = response.data.items
        this.table_data.pagination = response.data.pagination
        this.total_records         = response.data.pagination.total_items
      }
      else{
        this.showAlertDialog(response.error_messages)
      }
    },
    async onSearchAsync(){
      this.table_filter.page_number = DEFAULT_NUMBER_PAGE
      await this.loadDataTableAsync()
    },
    async onChangePagesAsync(page){
      this.table_filter.page_number = page
      await this.loadDataTableAsync()
    },

    onInputDate(data){
      this.table_filter.from_date = data.value.from_date
      this.table_filter.to_date   = data.value.to_date
    },

    formatOldOrNewValue(history_type,value){
      let text = ''
      switch(history_type){
        case sales_options.balance_point_edit_history_type_enum.card_balance:
          text = formatMoney(value,0)
          break
        case sales_options.balance_point_edit_history_type_enum.card_expire_date:
          text = SalesUtils.formatNoLimitDateTs(value)
          break
        case sales_options.balance_point_edit_history_type_enum.service_quantity:
          text = SalesUtils.formatNoLimitNumber(value,0)
          break
        case sales_options.balance_point_edit_history_type_enum.service_expire_date:
          text = SalesUtils.formatNoLimitDateTs(value)
          break
        case sales_options.balance_point_edit_history_type_enum.client_point:
          text = formatMoney(value,0)
          break
        case sales_options.balance_point_edit_history_type_enum.family_point:
          text = formatMoney(value,0)
          break
      }
      return text
    },

    formatEditedItem(row){
      let text = `<span>{type}</span> <br/>
                  <span class="blue-text">{blue_text}</span>`
      let history_type = _.find(this.balance_point_edit_history_type_text,x => x.value == row.history_type)
      let type_name    = ''
      let blue_text    = ''
      
      switch(row.history_type){
        case sales_options.balance_point_edit_history_type_enum.card_balance:
          blue_text = row.prepaid_goods_name
          break
        case sales_options.balance_point_edit_history_type_enum.card_expire_date:
          blue_text = row.prepaid_goods_name
          break
        case sales_options.balance_point_edit_history_type_enum.service_quantity:
          blue_text = row.prepaid_goods_name
          break
        case sales_options.balance_point_edit_history_type_enum.service_expire_date:
          blue_text = row.prepaid_goods_name
          break
        case sales_options.balance_point_edit_history_type_enum.client_point:
          if(row.client_points_history_type == sales_options.client_points_history_type_enum.added_to_family)
            blue_text = this.to_family_point_text
          if(row.client_points_history_type == sales_options.client_points_history_type_enum.manual_edited && row.family_id > 0) 
            blue_text = this.change_family_point_text
          if(row.client_points_history_type == sales_options.client_points_history_type_enum.departed_from_family) 
            blue_text = this.from_family_point_text
          break
      }

      type_name = history_type != undefined ? history_type.text : ''
      blue_text = blue_text.length > 0 ? `(${blue_text})` : ''
      text = text.replace('{type}',type_name)
      text = text.replace('{blue_text}',blue_text)
      return text
    },
    formatNotes(row){
      let notes = ''
      switch(row.history_type){
        case sales_options.balance_point_edit_history_type_enum.client_point:
          if(row.client_points_history_type == sales_options.client_points_history_type_enum.added_to_family)
            notes = this.to_family_notes_text
          if(row.client_points_history_type == sales_options.client_points_history_type_enum.manual_edited && row.family_id > 0) 
            notes = this.change_family_notes_text
          if(row.client_points_history_type == sales_options.client_points_history_type_enum.departed_from_family) 
            notes = this.from_family_notes_text
          break
      }
      return notes
    }
  }
}
</script>

<style lang="scss">
@import './balance-point-edit-history.scss';
</style>
