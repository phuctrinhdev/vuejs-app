<template>
  <div class="prepaid-card-history-wrapper">
    <div class="cl-info-inner">

      <!-- TABLE -->
      <view-table :data="table_data" @change-page="onChangePage">
        <!-- MOBILE -->
        <template slot="mobile" slot-scope="{row}">
          <div class="show-mobile-text-box">
            <p>
              <span>{{ moment(convertTimeStampToDate(row.created_date_time_ts)).format(common_options.standard_date_format.ymdh) }}</span>
              <span>{{ formatAction(row.prepaid_card_history_type) }}</span>
              <span v-if="row.balance_before_change != row.balance">
                {{ formatMoney(row.balance_before_change) }} ➝ 
                {{ formatMoney(row.balance) }}
              </span>
            </p>
            <p>
              <span>{{ formatPrepaidCard(row) }}</span>
              <span v-if="row.client_name != null && row.client_name != x_client_information.data.client_name">{{ formatNotes(row) }}</span>
            </p>
            <p v-if="row.expiry_date_ts_before_changed != row.expiry_date_ts && row.expiry_date_ts_before_changed != 0">
              {{ expiry_date_is_edited_text }} : 
              {{ SalesUtils.formatNoLimitDateTs(row.expiry_date_ts_before_changed) }} ➝ 
              {{ SalesUtils.formatNoLimitDateTs(row.expiry_date_ts) }}
            </p>
            <div v-if="canDeleteHistory(row)" class="btn" @click="onDeleteHistory(row)">{{ $t('general.del') }}</div>
          </div>
        </template>

        <!-- PC -->
        <template slot="branch_number" slot-scope="{row}">
          <div :id="'tooltip-branch-number' + row.id">
            {{ row.branch_number }}
          </div>
          <b-tooltip :target="'tooltip-branch-number' + row.id" placement="bottom">
            {{ row.shop_name }}
          </b-tooltip>
        </template>
        <template slot="date" slot-scope="{row}">
          {{ formatDate(row.created_date_time_ts) }}
        </template>
        <template slot="prepaid_card" slot-scope="{row}">
          {{ formatPrepaidCard(row) }}
        </template>
        <template slot="action" slot-scope="{row}">
          {{ formatAction(row.prepaid_card_history_type) }}
        </template>
        <template slot="change" slot-scope="{row}">
          {{ formatChangeBalance(row) }}
        </template>
        <template slot="balance" slot-scope="{row}">
          {{ formatMoney(row.balance,0) }}
        </template>
        <template slot="notes" slot-scope="{row}">
          <p v-if="row.client_name != null && row.client_name != x_client_information.data.client_name">{{ formatNotes(row) }}</p>
          <p v-if="row.expiry_date_ts_before_changed != 0 && row.expiry_date_ts_before_changed != row.expiry_date_ts">
            {{ expiry_date_is_edited_text }} : 
            {{ SalesUtils.formatNoLimitDateTs(row.expiry_date_ts_before_changed) }} ➝ 
            {{ SalesUtils.formatNoLimitDateTs(row.expiry_date_ts) }}
          </p>
        </template>
        <template slot="delete" slot-scope="{row}">
          <div v-if="canDeleteHistory(row)" class="btn" @click="onDeleteHistory(row)">{{ $t('general.del') }}</div>
        </template>
      </view-table>

      <alert-confirm :id="alert_id" :data_alerts="alert_data"
                     @confirm="onAlertConfirm" @cancel="onAlertCancel"/>
    </div>
  </div>
</template>

<script>
import _                         from 'lodash'
import moment                    from 'moment'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import component_base            from '../../common/component-base/component-base'
import view_table                from '../../../components/common/view-table/view-table'
import PrepaidCardsHistoryAPI    from '../../../api/sales/prepaid-cards-history-api'
import { common_options }        from '../../../helpers/options/common-options'
import { sales_options }         from '../../../helpers/options/sales-options'
import SalesUtils                from '../../../helpers/utils/sales-utils'
import alert_confirm             from '../../../components/common/alert/alert-confirm'
import BalanceMoveApi            from '../../../api/sales/balance-move-api'

import { formatMoney, 
  convertTimeStampToDate, 
  convertDateToTimezone}       from '../../../helpers/common'
export default {
  components:{
    'view-table'   : view_table,
    'alert-confirm': alert_confirm
  },
  extends : component_base,
  data(){
    return {
      SalesUtils,
      common_options,
      sales_options,
      prepaid_cards_history_api: new PrepaidCardsHistoryAPI(),
      balance_move_api         : new BalanceMoveApi(),

      table_custom_fields: [
        { field : 'branch_number',label :'sales-prepaid-card-tab.loc',          width: '7%',   sortable: false, expand: true},
      ],

      table_data:{
        fields : [
          {field :'mobile',       label : '',                                   width: 'auto', sortable: false, thClass: 'mobile',  expand: true, tdClass: 'mobile', column_expand: true },
          {field :'date',         label :'sales-prepaid-card-tab.date',         width: '13%',  sortable: false, expand: true},
          {field :'prepaid_card', label :'sales-prepaid-card-tab.prepaid-card', width: '20%',  sortable: false, expand: true},
          {field :'action',       label :'sales-prepaid-card-tab.action',       width: '10%',  sortable: false, expand: true},
          {field :'change',       label :'sales-prepaid-card-tab.change',       width: '10%',  sortable: false, expand: true},
          {field :'balance',      label :'sales-prepaid-card-tab.balance',      width: '10%',  sortable: false, expand: true},
          {field :'notes',        label :'sales-prepaid-card-tab.notes',        width: '25%',  sortable: false, expand: true},
          {field :'delete',       label :'general.delete',                      width: '5%',   sortable: false, expand: true}
        ],
        rows      : [],
        pagination: {
          total_pages: 1
        },
        options : {
          pagination: true
        }
      },
      table_filter : {
        client_id: 0,
        page_size: common_options.pagination.default,
        page_number: 1,
        shop_id: 0
      },

      delete_balance_move: {},

      alert_id: 'warning-delete-prepaid-card-history',
      alert_data: [],

    }
  },
  computed:{
    ...mapGetters('client',{
      x_client_information : 'getClientInformation'
    }),
    ...mapGetters('sales_prepaid_card_history',{
      x_prepaid_card_histories : 'getPrepaidCardHistories'
    }),
    used_by_text(){return this.$i18n.t('sales-prepaid-card-tab.used-by')},
    refund_text(){return this.$i18n.t('sales-prepaid-card-tab.refund')},
    expiry_date_is_edited_text(){return this.$i18n.t('sales-prepaid-card-tab.expiry-date-is-edited')},
    warning_want_to_delete(){return this.$i18n.t('sales.warning-want-to-delete')}
  },
  async created(){
    this.table_filter.shop_id      = this.shop_data.shop_id
    this.table_filter.client_id    = this.x_client_information.data.id

    if(this.shop_data.chain_id && this.shop_data.chain_sharing_settings.share_client){
      this.table_data.fields = [...this.table_custom_fields, ...this.table_data.fields]
    }

    await this.loadDataTableAsync()
  },
  methods:{
    ...mapActions('sales_prepaid_card_history',[
      'loadSalesPrepaidCardHistoriesAsyncData'
    ]),
    ...mapMutations('sales_prepaid_card_history',[
      'setPrepaidCardHistoriesFilter'
    ]),
    
    async loadDataTableAsync(){
      this.setPrepaidCardHistoriesFilter(this.table_filter)

      this.preLoader()
      let response = await this.loadSalesPrepaidCardHistoriesAsyncData(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        this.setTableData()
      }
      else this.showAlertDialog(response.error_messages)
    },
    setTableData(){
      this.table_data.rows       = this.x_prepaid_card_histories.items
      this.table_data.pagination = this.x_prepaid_card_histories.pagination
    },
    async onChangePage(page){
      this.table_filter.page_number = page
      await this.loadDataTableAsync()
    },
    isDataOfCurrentShop(row){
      return row.shop_id == this.shop_data.shop_id
    },
    canDeleteHistory(row){
      return (row.prepaid_card_history_type == sales_options.prepaid_card_history_type_enum.balance_move_in 
          || row.prepaid_card_history_type == sales_options.prepaid_card_history_type_enum.balance_move_out)
          && this.isDataOfCurrentShop(row)
    },

    // action
    async onDeleteHistory(row){
      this.delete_balance_move = row
      this.alert_data = [this.warning_want_to_delete]
      this.showDialogById(this.alert_id)
    },
    onAlertConfirm(){
      this.deleteHistory()
    },
    onAlertCancel(){
      this.hideDialogById(this.alert_id)
    },
    async deleteHistory(){
      let delete_balance_move = {
        history_id    : this.delete_balance_move.id,
        client_id     : this.delete_balance_move.client_id,
        session_token : this.x_user.session_token,
        shop_location : this.shop_data.shop_location,
        shop_id       : this.shop_data.shop_id
      }
      this.preLoader()
      let response = await this.balance_move_api.deleteBalanceMoveByHistoryIdAsync(delete_balance_move)
      this.preLoader(false)
      
      if(response.is_ok){
        this.loadDataTableAsync()
      }
      else {
        this.showAlert(response.error_messages)
      }
    },

    // format
    formatDate(created_date_time_ts){
      let tmp_date = convertDateToTimezone(convertTimeStampToDate(created_date_time_ts))
      return moment(tmp_date).format(common_options.standard_date_format.ymd)
    },
    formatAction(action){
      let text = ''
      let prepaid_card_history_type = _.find(sales_options.prepaid_card_history_type,t=>t.value == action)
      if (prepaid_card_history_type != undefined){
        text =  this.$i18n.t(prepaid_card_history_type.text)
      }
      return text
    },
    formatPrepaidCard(prepaid_card){
      let move_in_type  = sales_options.prepaid_card_history_type_enum.balance_move_in
      let move_out_type = sales_options.prepaid_card_history_type_enum.balance_move_out
      let history_type  = prepaid_card.prepaid_card_history_type
      if(history_type == move_in_type || history_type == move_out_type){
        return `${prepaid_card.from_card} ➝ ${prepaid_card.to_card}`
      }
      return prepaid_card.card_name
    },
    formatChangeBalance(prepaid_card){
      let text = ''
      let balance_before_change = prepaid_card.balance_before_change
      let balance = prepaid_card.balance
      if(typeof balance_before_change != 'number' || typeof balance != 'number') return text
      let after_changes_balance = prepaid_card.balance - prepaid_card.balance_before_change
      text = after_changes_balance > 0 ? `+${formatMoney(after_changes_balance,0)}` : formatMoney(after_changes_balance,0)
      return text
    },
    formatNotes(row){
      return `${this.used_by_text} ${row.client_name}`
    },

    formatMoney,
    convertTimeStampToDate,
    moment
  }
}
</script>

<style lang="scss">
@import './sales-prepaid-cards-history.scss';
</style>