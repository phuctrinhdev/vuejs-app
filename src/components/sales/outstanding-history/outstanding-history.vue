<template>
  <div class="receivables-history-action-wrapper">
    <b-modal id="receivables-history-action-modal"
             :title="$t('outstanding-history.outstanding-history')"
             :no-close-on-backdrop="true"
             size="xl"
             hide-footer
             class="receivables-history-action-modal"
             @show="onLoadFormAsync()"
             @hide="onCancel()">

      <!-- BEGIN MODAL-BODY -->
      <div class="modal-body">
        <view-table :data="table_data">
          <template slot="date" slot-scope="{row}">
            {{ formatDate(row) }}
          </template>
          <template slot="changed" slot-scope="{row}">
            {{ formatChangedAmount(row) }}
          </template>
          <template slot="type" slot-scope="{row}">
            {{ SalesUtils.formatOutstandingHistoryType(row.outstanding_history_type) }}
          </template>
          <template slot="amount" slot-scope="{row}">
            {{ formatMoney(row.outstanding,0) }}
          </template>
        </view-table>
      </div>
      <!-- END MODAL-BODY -->

      <!-- BEGIN MODAL-FOOTER -->
      <footer class="modal-footer">
        <a class="btn default cancel" block @click="hideModal">{{ $t('general.close') }}</a>
      </footer>
      <!-- END MODAL-FOOTER -->

    </b-modal>
  </div>
</template>

<script>
const DEFAULT_NUMBER_PAGE  = 1
const DEFAULT_FROM_DATE    = -1
const DEFAULT_TO_DATE      = -1
const DEFAULT_TYPE         = -1

import { mapGetters }                          from 'vuex'
import moment                                  from 'moment'
import { common_options }                      from '../../../helpers/options/common-options.js'
import component_base                          from '../../../components/common/component-base/component-base.vue'
import view_table                              from '../../../components/common/view-table/view-table.vue'
import OutstandingHistoryApi                   from '../../../api/sales/outstanding-history-api.js'
import SalesUtils                              from '../../../helpers/utils/sales-utils.js'

import { convertTimeStampToDate, 
  formatMoney, 
  convertTimeStampMinusLocalzone
}  from '../../../helpers/common.js'


export default {
  components : {
    'view-table'       : view_table
  },
  extends : component_base,
  data(){
    return {
      SalesUtils,
      common_options,
      outstanding_api : {},
      table_data   : {
        fields : [
          {field: 'date',       label: 'outstanding-history.date',   width: '20%',   sortable: false, expand: true},
          {field: 'type',       label: 'outstanding-history.type',   width: '20%',   sortable: false, expand: true},
          {field: 'changed',    label: 'outstanding-history.changed',width: '15%',   sortable: false, expand: true},
          {field: 'amount',     label: 'outstanding-history.amount', width: '15%',   sortable: false, expand: true},
          {field: 'notes',      label: 'outstanding-history.notes',  width: '30%',   sortable: false}
        ],
        rows   : [],
        pagination : {},
        options : {
          pagination: false
        }
      },
      table_filter : {
        client_id    : 0,
        keyword      : '',
        from_date    : {},
        to_date      : {},
        page_size    : common_options.pagination.small,
        page_number  : DEFAULT_NUMBER_PAGE,
        shop_id      : 0,
        outstanding_history_type : DEFAULT_TYPE
      }
    }
  },
  computed:{
    ...mapGetters('sales_client_account',{
      x_client_account_action : 'getClientAccountAction'
    })
  },
  created(){
    this.table_filter.shop_id   = this.shop_data.shop_id
    this.table_filter.from_date = {text : undefined, value : DEFAULT_FROM_DATE}
    this.table_filter.to_date   = {text : undefined, value : DEFAULT_TO_DATE}
    this.outstanding_api = new OutstandingHistoryApi()
  },
  methods : {
    async onLoadFormAsync(){
      this.table_filter.client_id = this.x_client_account_action.data.client_id
      await this.loadDataTableAsync()
    },

    async loadDataTableAsync(){
      this.preLoader()
      let response = await this.outstanding_api.getOutstandingHistoriesAsync(this.table_filter)
      this.preLoader(false)
      if (response.is_ok){
        this.table_data.rows = response.data.items
      }else{
        this.showAlertDialog(response.error_messages)
      }
    },

    formatChangedAmount(outstanding_history){
      let text = ''
      if(outstanding_history){
        let changed_amount = Number(outstanding_history.outstanding) - Number(outstanding_history.outstanding_before_change)
        text = changed_amount > 0 ?  
          `+${formatMoney(changed_amount,0)}` : 
          `${formatMoney(changed_amount,0)}`
      }
      return text
    },

    onCancel(){
      this.hideModal()
    },
    hideModal(){
      this.hideDialogById('receivables-history-action-modal')
    },

    // format
    formatDate(row){
      let tmp_date_time_ts = convertTimeStampToDate(convertTimeStampMinusLocalzone(row.invoice_date_time_ts))
      return moment(tmp_date_time_ts).format(common_options.standard_date_format.ymdh)
    },

    moment,
    formatMoney,
    convertTimeStampToDate
  }
}
</script>

<style lang="scss">
@import './outstanding-history.scss';
</style>
