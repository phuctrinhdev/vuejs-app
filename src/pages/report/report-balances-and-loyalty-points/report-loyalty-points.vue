<template>
  <div class="report report-loyalty-points">
    <div class="intro" v-html="table_intro"/>
    <div class="table table-loyalty-points">
      <view-table :data="table_data" @change-page="onChangePage">
        <template slot="client_number" slot-scope="{ row }">
          {{ formatMoney(row.client_number, 0) }}
        </template>
        <template slot="points" slot-scope="{ row }">
          {{ formatMoney(row.points, 0) }} <span v-if="row.is_family > 0">({{ $t('client-information.family') }})</span>
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
          { field: 'client_number', label: 'clients.client-number', width: '30%',   sortable: false, expand: true },
          { field: 'client_name',   label: 'sales.client-name',     width: '40%',   sortable: false },
          { field: 'points',        label: 'sales.points',          width: '30%',   sortable: false, expand: true },
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
      let tmp = this.$i18n.t('report.loyalty-points-intro')
      tmp = tmp.replace('{records}', formatMoney(this.table_intro_records,0))
      tmp = tmp.replace('{amount}', formatMoney(this.table_intro_amount,0))
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
      let response = await this.report_api.getLoyaltyPointsReportAsync(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        this.table_data.rows       = response.data.items
        this.table_data.pagination = response.data.pagination
        this.table_intro_records   = response.data.summary.total_client
        this.table_intro_amount    = response.data.summary.total_points
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    async onChangePage(page_number){
      this.table_filter.page_number = page_number
      await this.loadTableDataAsync()
    }
  }
}
</script>