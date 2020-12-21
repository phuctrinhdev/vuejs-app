<template>
  <div class="report report-prepaid-services">
    <div class="intro" v-html="table_intro"/>
    <div class="table table-prepaid-services">
      <view-table :data="table_data" @change-page="onChangePage">  
        <template slot="remaining_quantity" slot-scope="{ row }">
          {{ sales_utils.formatNoLimitNumber(row.remaining_quantity, 0) }}
        </template>
        <template slot="expiry_date_ts" slot-scope="{ row }">
          {{ sales_utils.formatNoLimitDateTs(row.expiry_date_ts) }}
        </template>
        <template slot="remaining_amount" slot-scope="{ row }">
          {{ formatMoney(row.remaining_amount, 0) }}
        </template>
        <template slot="sales_date_ts" slot-scope="{ row }">
          {{ formatDate(row) }}
        </template>
        <template slot="sales_amount" slot-scope="{ row }">
          {{ formatMoney(row.sales_amount, 0) }}
        </template>
      </view-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import component_base from '../../../components/common/component-base/component-base'
import { options } from '../../../helpers/options'
import view_table from '../../../components/common/view-table/view-table'
import ReportApi from '../../../api/sales/report-api'
import { formatMoney } from '../../../helpers/common'
import SalesUtils from '../../../helpers/utils/sales-utils'

export default {
  components: {
    'view-table': view_table
  },
  extends : component_base,
  data(){
    return {
      options,
      sales_utils: SalesUtils,

      report_api: new ReportApi(),

      table_data   : {
        fields : [
          { field: 'client_name',         label: 'sales.client-name',             width: '15%',   sortable: false },
          { field: 'prepaid_service_name',label: 'services.prepaid-service-name', width: '25%',   sortable: false },
          { field: 'remaining_quantity',  label: 'sales.remaining-quantity',      width: '12%',   sortable: false, expand: true },
          { field: 'expiry_date_ts',      label: 'refund.expiry-date',            width: '12%',   sortable: false, expand: true },
          { field: 'remaining_amount',    label: 'report.remaining-amount',       width: '12%',   sortable: false, expand: true },
          { field: 'sales_date_ts',       label: 'sales.sales-date',              width: '12%',   sortable: false, expand: true },
          { field: 'sales_amount',        label: 'sales.sales-amount',            width: '12%',   sortable: false, expand: true },
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
        page_size   : options.pagination.default,
        page_number : 1,
        shop_id     : 0
      },
      table_intro_records: 0,
      table_intro_amount: 0,
    }
  },
  computed:{
    table_intro(){
      let tmp = this.$i18n.t('report.prepaid-services-intro')
      tmp = tmp.replace('{records}', formatMoney(this.table_data.pagination.total_items,0))
      tmp = tmp.replace('{amount}', formatMoney(this.table_intro_amount,0))
      return tmp
    }
  },
  created(){
    this.table_filter.shop_id = this.shop_data.shop_id
    this.loadTableDataAsync()
  },
  methods:{
    moment,
    formatMoney,

    async loadTableDataAsync(){
      this.preLoader()
      let response = await this.report_api.getPrepaidServicesReportAsync(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        this.table_data.rows       = response.data.items
        this.table_data.pagination = response.data.pagination
        this.table_intro_amount    = response.data.total_remaining_amount
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
    formatDate(row){
      return moment(new Date(row.sales_date_ts * 1000)).format(options.standard_date_format.ymd)
    }
  }
}
</script>