<template>
  <div class="report report-prepaid-card-summary">
    <div class="intro" v-html="table_intro"/>
    <div class="table table-prepaid-card-summary">
      <view-table :data="table_data" @change-page="onChangePage">  
        <template slot="total_clients" slot-scope="{ row }">
          {{ formatMoney(row.total_clients, 0) }}
        </template>
        <template slot="total_amount" slot-scope="{ row }">
          {{ formatTotalAmount(row) }}
        </template>
      </view-table>
    </div>
  </div>
</template>

<script>
import component_base                from '../../../components/common/component-base/component-base'
import { options } from '../../../helpers/options'
import view_table from '../../../components/common/view-table/view-table'
import ReportApi from '../../../api/sales/report-api'
import { formatMoney } from '../../../helpers/common'

export default {
  components: {
    'view-table': view_table
  },
  extends : component_base,
  data(){
    return {
      report_api: new ReportApi(),

      table_data   : {
        fields : [
          { field: 'prepaid_card_name', label: 'prepaid-cards.prepaid-card-name', width: '50%',   sortable: false },
          { field: 'total_clients',     label: 'report.number-of-clients',        width: '20%',   sortable: false, expand: true },
          { field: 'total_amount',      label: 'report.remaining-balance',        width: '30%',   sortable: false, expand: true },
        ],
        rows   : [],
        pagination : {
          total_pages: 1
        },
        options : { 
          pagination: true 
        }
      },
      table_filter: {
        page_size   : options.pagination.max,
        page_number : 1,
        shop_id     : 0
      },
      table_intro_records: 0,
      table_intro_amount : 0,
    }
  },
  computed:{
    table_intro(){
      let tmp = this.$i18n.t('report.prepaid-card-summary-intro')
      tmp = tmp.replace('{clients}', formatMoney(this.table_intro_records,0))
      tmp = tmp.replace('{amount}',  formatMoney(this.table_intro_amount,0))
      return tmp
    }
  },
  created(){
    this.table_filter.shop_id = this.shop_data.shop_id
    this.loadTableDataAsync()
  },
  methods:{
    formatMoney,

    async loadTableDataAsync(){
      this.preLoader()
      let response = await this.report_api.getPrepaidCardSummaryReportAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        this.table_data.rows       = response.data.items
        this.table_data.pagination = response.data.pagination
        this.table_intro_records   = response.data.summary.total_clients
        this.table_intro_amount    = response.data.summary.total_remaining_amount
        this.$forceUpdate()
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    async onChangePage(page_number){
      this.table_filter.page_number = page_number
      await this.loadTableDataAsync()
    },

    // format
    formatTotalAmount(row){
      let tmp_balance = formatMoney(row.total_amount, 0)
      if(tmp_balance == 0)
        tmp_balance = '-'
      return tmp_balance
    },
  }
}
</script>