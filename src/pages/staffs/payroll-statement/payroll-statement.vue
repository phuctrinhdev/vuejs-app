<template>
  <main class="app-content">
    <section class="content payroll-statement-page">
      <div class="page-title">
        <h3>{{ $t('payroll.payroll-statement') }}</h3>
        <ul class="group-btn">
          <li class="btn"><router-link :to="{ name: 'payroll-setup' }">{{ $t('payroll.payroll-setup') }}</router-link></li>
        </ul>
      </div>

      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-md-10 filter">
            <input-date-range-by-date-type ref="input_date_range_by_date_type" v-model="table_filter"/>
            <div class="staff">
              <label>{{ $t('general.staff') }}</label>
              <b-form-select v-model="table_filter.staff_id"
                             :options="staff_options" value-field="id" text-field="aliasname"
                             @mouseleave.native="onMouseLeaveSelect"/>
            </div>
          </div>
          <div class="col-12 col-md-2">
            <div class="filter-search">
              <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
            </div>
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th rowspan="2" width="15%">{{ $t('sales.staff') }}</th>
              <th colspan="2" width="24%">{{ $t('report.service') }}</th>
              <th colspan="2" width="24%">{{ $t('report.product') }}</th>
              <th rowspan="2" width="10%">{{ $t('report.prepaid-cards') }}</th>
              <th rowspan="2" width="10%">{{ $t('report.prepaid-services') }}</th>
              <th rowspan="2" width="10%">{{ $t('general.total') }}</th>
              <th rowspan="2" width="8%">{{ $t('payroll.details') }}</th>
            </tr>
            <tr>
              <th width="12%">{{ $t('sales.sales') }}</th>
              <th width="12%">{{ $t('sales.deduction') }}</th>
              <th width="12%">{{ $t('sales.sales') }}</th>
              <th width="12%">{{ $t('sales.deduction') }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="payroll_statement.fields.summary.length == 0">
              <tr>
                <td colspan="11" class="table-no-data">{{ text_no_data_for_table }}</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="(row, i) in payroll_statement.fields.summary" :key="i">
                <td>{{ formatName(row.staff_name) }}</td>
                <td>{{ formatNumber(row.service_sales) }}</td>
                <td>{{ formatNumber(row.service_deduction) }}</td>
                <td>{{ formatNumber(row.product_sales) }}</td>
                <td>{{ formatNumber(row.product_deduction) }}</td>
                <td>{{ formatNumber(row.prepaid_cards) }}</td>
                <td>{{ formatNumber(row.prepaid_services) }}</td>
                <td>{{ formatNumber(row.total) }}</td>
                <td>
                  <div v-if="i != payroll_statement.fields.summary.length - 1" class="btn download-detail" @click="onDownloadExcel(row.staff_name)">Excel</div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options.js'
import component_base                from '../../../components/common/component-base/component-base.vue'
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type.vue'
import staff_mixin                   from '../../../helpers/mixins/staff-mixin'
import PayrollStatementApi           from '../../../api/staffs/payroll-statement-api'
import PayrollStatementViewModel     from '../../../view-model/staffs/payroll-statement-view-model'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

import { 
  convertDateToTimeStamp,
  convertDateToTimezone,
  formatMoney
} from '../../../helpers/common'

export default {
  components: {
    'input-date-range-by-date-type': input_date_range_by_date_type,
  },
  extends: component_base,
  mixins: [staff_mixin],
  data(){
    return {
      options,
      common_options,
      
      payroll_statement_api: new PayrollStatementApi(),
      payroll_statement    : new PayrollStatementViewModel(),

      table_filter : {
        from_date_ts  : 0,
        to_date_ts    : 0,
        staff_id      : -1,
        shop_id       : 0,
        
        // ui only
        date_type     : common_options.date_type.month,
        from_date     : {},
        to_date       : {},
      },
      
      staff_options   : [],
    }
  },
  computed:{
    text_all(){ return this.$i18n.t('general.all') },
    text_total(){ return this.$i18n.t('general.total') },
    text_no_data_for_table(){return this.$i18n.t('general.no-data-for-table')},
    error_date_range_can_not_exceed_1_month(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_month')},
    error_date_range_can_not_cross_months(){return this.$i18n.t('report.error_date_range_can_not_cross_months')},
  },
  async mounted(){
    this.table_filter.shop_id = this.shop_data.shop_id

    await this.loadStaffItemsAsync()
    await this.loadTableDataAsync()
  },
  methods:{
    moment,

    // filter
    async loadStaffItemsAsync(){
      let tmp_all_option = { id: -1, aliasname: this.text_all }
      let response = await this.getStaffsAsyncMixin()
      if(response.is_ok){
        this.staff_options = [tmp_all_option , ...response.data.items]
        this.table_filter.staff_id = tmp_all_option.id
      }
      else 
        this.showAlert(response.error_messages)
    },
    
    // table
    async loadTableDataAsync(){
      if(this.table_filter.date_type == common_options.date_type.date_range){
        let errors = [...this.$refs.input_date_range_by_date_type.errors]
        let tmp_to_date_limit    = moment(new Date(this.table_filter.from_date.value * 1000)).add(1, 'month').toDate()
        let tmp_to_date_limit_ts = convertDateToTimeStamp(tmp_to_date_limit) - 1
        let tmp_from_month = this.table_filter.from_date.text.getMonth()
        let tmp_to_month   = this.table_filter.to_date.text.getMonth()

        if(this.table_filter.to_date.value > tmp_to_date_limit_ts){
          errors.push(this.error_date_range_can_not_exceed_1_month)
        }
        if(tmp_from_month != tmp_to_month){
          errors.push(this.error_date_range_can_not_cross_months)
        }
        if(errors.length > 0){
          this.showAlert(errors)
          return
        }
      }

      this.preLoader()
      let response = await this.payroll_statement_api.getPayrollStatementAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        this.payroll_statement.setFields(response.data)
      }
      else{
        this.showAlert(response.error_messages)
      }
    },
    onSearch(){
      this.loadTableDataAsync()
    },
    async onDownloadExcel(staff_name){//
      // staff_data
      let staff_services        = _.groupBy(this.payroll_statement.fields.services, item => item.staff_name == staff_name).true
      let staff_products        = _.groupBy(this.payroll_statement.fields.products, item => item.staff_name == staff_name).true
      let staff_prepaid_cards   = _.groupBy(this.payroll_statement.fields.prepaid_cards, item => item.staff_name == staff_name).true
      let staff_prepaid_services= _.groupBy(this.payroll_statement.fields.prepaid_services, item => item.staff_name == staff_name).true

      if(staff_services == undefined) staff_services = []
      if(staff_products == undefined) staff_products = []
      if(staff_prepaid_cards == undefined) staff_prepaid_cards = []
      if(staff_prepaid_services == undefined) staff_prepaid_services = []

      // workbook
      const wb = new ExcelJS.Workbook()
      const ws = wb.addWorksheet()
      ws.properties.defaultColWidth  = 15

      // table style
      let row_title_payroll = ws.addRow([`${staff_name} Payroll`])
      row_title_payroll.font = { bold: true, size: 16 }
      
      let from_date = moment(convertDateToTimezone(new Date(this.table_filter.from_date_ts * 1000))).format(options.standard_date_format.ymd)
      let to_date   = moment(convertDateToTimezone(new Date(this.table_filter.to_date_ts * 1000))).format(options.standard_date_format.ymd)
      let date_range_payroll = `Date range: ${from_date} ~ ${to_date}`
      let creadted_payroll = `Created date time: ${moment(convertDateToTimezone(new Date())).format(options.standard_date_format.ymdh)}`
      ws.addRow([`${date_range_payroll},         ${creadted_payroll}`])
      ws.addRow()
      ws.addRow()

      // service
      let row_title_service = ws.addRow(['Service Sales/Deductions'])
      row_title_service.font = { bold: true, size: 12 }
      let row_cols_service = ws.addRow([
        'Date',
        'Client Name',
        'Type',
        'Service Name',
        'Qty',
        'Sales Amount',
        'Salary Sales Setting',
        'Salary for Sales',
        'Prepaid Card Deduction',
        'Prepaid Service Deduction',
        'Salary Deduction Setting',
        'Salary for Deductions'
      ])
      this.setCellBorders(`A${row_cols_service.number}`, ws)
      this.setCellBorders(`B${row_cols_service.number}`, ws)
      this.setCellBorders(`C${row_cols_service.number}`, ws)
      this.setCellBorders(`D${row_cols_service.number}`, ws)
      this.setCellBorders(`E${row_cols_service.number}`, ws)
      this.setCellBorders(`F${row_cols_service.number}`, ws)
      this.setCellBorders(`G${row_cols_service.number}`, ws)
      this.setCellBorders(`H${row_cols_service.number}`, ws)
      this.setCellBorders(`I${row_cols_service.number}`, ws)
      this.setCellBorders(`J${row_cols_service.number}`, ws)
      this.setCellBorders(`K${row_cols_service.number}`, ws)
      this.setCellBorders(`L${row_cols_service.number}`, ws)
      this.setCellBackground(`G${row_cols_service.number}`, ws)
      this.setCellBackground(`L${row_cols_service.number}`, ws)
      for(let item of staff_services){
        let tmp_row = ws.addRow([
          item.invoice_date_ts,
          item.client_name,
          item.salary_type,
          item.item_name,
          item.quantity,
          item.sales_amount,
          item.salary_sales_setting,
          item.salary_for_sales,
          item.prepaid_card_deduction,
          item.prepaid_service_deduction,
          item.salary_deduction_setting,
          item.salary_for_deduction,
        ])
        this.setCellBorders(`A${tmp_row.number}`, ws)
        this.setCellBorders(`B${tmp_row.number}`, ws)
        this.setCellBorders(`C${tmp_row.number}`, ws)
        this.setCellBorders(`D${tmp_row.number}`, ws)
        this.setCellBorders(`E${tmp_row.number}`, ws)
        this.setCellBorders(`F${tmp_row.number}`, ws)
        this.setCellBorders(`G${tmp_row.number}`, ws)
        this.setCellBorders(`H${tmp_row.number}`, ws)
        this.setCellBorders(`I${tmp_row.number}`, ws)
        this.setCellBorders(`J${tmp_row.number}`, ws)
        this.setCellBorders(`K${tmp_row.number}`, ws)
        this.setCellBorders(`L${tmp_row.number}`, ws)
        this.setCellAlignment(`A${tmp_row.number}`, ws)
        this.setCellBackground(`G${tmp_row.number}`, ws)
        this.setCellBackground(`L${tmp_row.number}`, ws)
      }
      ws.addRow()
      ws.addRow()
      
      // product
      let row_title_product = ws.addRow(['Product Sales/Deductions'])
      row_title_product.font = { bold: true, size: 12 }
      let row_cols_product = ws.addRow([
        'Date',
        'Client Name',
        'Type',
        'Product Name',
        'Qty',
        'Sales Amount',
        'Salary Sales Setting',
        'Salary for Sales',
        'Prepaid Card Deduction',
        'Salary Deduction Setting',
        'Salary for Deductions'
      ])
      this.setCellBorders(`A${row_cols_product.number}`, ws)
      this.setCellBorders(`B${row_cols_product.number}`, ws)
      this.setCellBorders(`C${row_cols_product.number}`, ws)
      this.setCellBorders(`D${row_cols_product.number}`, ws)
      this.setCellBorders(`E${row_cols_product.number}`, ws)
      this.setCellBorders(`F${row_cols_product.number}`, ws)
      this.setCellBorders(`G${row_cols_product.number}`, ws)
      this.setCellBorders(`H${row_cols_product.number}`, ws)
      this.setCellBorders(`I${row_cols_product.number}`, ws)
      this.setCellBorders(`J${row_cols_product.number}`, ws)
      this.setCellBorders(`K${row_cols_product.number}`, ws)
      this.setCellBackground(`G${row_cols_product.number}`, ws)
      this.setCellBackground(`K${row_cols_product.number}`, ws)
      for(let item of staff_products){
        let tmp_row = ws.addRow([
          item.invoice_date_ts,
          item.client_name,
          item.salary_type,
          item.item_name,
          item.quantity,
          item.sales_amount,
          item.salary_sales_setting,
          item.salary_for_sales,
          item.prepaid_card_deduction,
          item.salary_deduction_setting,
          item.salary_for_deduction,
        ])
        this.setCellBorders(`A${tmp_row.number}`, ws)
        this.setCellBorders(`B${tmp_row.number}`, ws)
        this.setCellBorders(`C${tmp_row.number}`, ws)
        this.setCellBorders(`D${tmp_row.number}`, ws)
        this.setCellBorders(`E${tmp_row.number}`, ws)
        this.setCellBorders(`F${tmp_row.number}`, ws)
        this.setCellBorders(`G${tmp_row.number}`, ws)
        this.setCellBorders(`H${tmp_row.number}`, ws)
        this.setCellBorders(`I${tmp_row.number}`, ws)
        this.setCellBorders(`J${tmp_row.number}`, ws)
        this.setCellBorders(`K${tmp_row.number}`, ws)
        this.setCellAlignment(`A${tmp_row.number}`, ws)
        this.setCellBackground(`G${tmp_row.number}`, ws)
        this.setCellBackground(`K${tmp_row.number}`, ws)
      }
      ws.addRow()
      ws.addRow()
      
      // prepaid card
      let row_title_prepaid_card = ws.addRow(['Prepaid Card Sales'])
      row_title_prepaid_card.font = { bold: true, size: 12 }
      let row_cols_prepaid_card = ws.addRow([
        'Date',
        'Client Name',
        'Type',
        'Prepaid Card Name',
        'Qty',
        'Sales Amount',
        'Prepaid Card Deduction',
        'Refund by Prepaid Card',
        'Net Sales',
        'Salary Sales Setting',
        'Salary',
      ])
      this.setCellBorders(`A${row_cols_prepaid_card.number}`, ws)
      this.setCellBorders(`B${row_cols_prepaid_card.number}`, ws)
      this.setCellBorders(`C${row_cols_prepaid_card.number}`, ws)
      this.setCellBorders(`D${row_cols_prepaid_card.number}`, ws)
      this.setCellBorders(`E${row_cols_prepaid_card.number}`, ws)
      this.setCellBorders(`F${row_cols_prepaid_card.number}`, ws)
      this.setCellBorders(`G${row_cols_prepaid_card.number}`, ws)
      this.setCellBorders(`H${row_cols_prepaid_card.number}`, ws)
      this.setCellBorders(`I${row_cols_prepaid_card.number}`, ws)
      this.setCellBorders(`J${row_cols_prepaid_card.number}`, ws)
      this.setCellBorders(`K${row_cols_prepaid_card.number}`, ws)
      this.setCellBackground(`K${row_cols_prepaid_card.number}`, ws)
      for(let item of staff_prepaid_cards){
        let tmp_row = ws.addRow([
          item.invoice_date_ts,
          item.client_name,
          item.salary_type,
          item.item_name,
          item.quantity,
          item.sales_amount,
          item.prepaid_card_deduction,
          item.refund_by_prepaid_card,
          item.net_sales,
          item.salary_sales_setting,
          item.salary_for_sales,
        ])
        this.setCellBorders(`A${tmp_row.number}`, ws)
        this.setCellBorders(`B${tmp_row.number}`, ws)
        this.setCellBorders(`C${tmp_row.number}`, ws)
        this.setCellBorders(`D${tmp_row.number}`, ws)
        this.setCellBorders(`E${tmp_row.number}`, ws)
        this.setCellBorders(`F${tmp_row.number}`, ws)
        this.setCellBorders(`G${tmp_row.number}`, ws)
        this.setCellBorders(`H${tmp_row.number}`, ws)
        this.setCellBorders(`I${tmp_row.number}`, ws)
        this.setCellBorders(`J${tmp_row.number}`, ws)
        this.setCellBorders(`K${tmp_row.number}`, ws)
        this.setCellAlignment(`A${tmp_row.number}`, ws)
        this.setCellBackground(`K${tmp_row.number}`, ws)
      }
      ws.addRow()
      ws.addRow()


      // prepaid service
      let row_title_prepaid_service = ws.addRow(['Prepaid Service Sales'])
      row_title_prepaid_service.font = { bold: true, size: 12 }
      let row_cols_prepaid_service = ws.addRow([
        'Date',
        'Client Name',
        'Type',
        'Prepaid Service Name',
        'Qty',
        'Sales Amount',
        'Prepaid Card Deduction',
        'Refund by Prepaid Card',
        'Net Sales',
        'Salary Sales Setting',
        'Salary',
      ])
      this.setCellBorders(`A${row_cols_prepaid_service.number}`, ws)
      this.setCellBorders(`B${row_cols_prepaid_service.number}`, ws)
      this.setCellBorders(`C${row_cols_prepaid_service.number}`, ws)
      this.setCellBorders(`D${row_cols_prepaid_service.number}`, ws)
      this.setCellBorders(`E${row_cols_prepaid_service.number}`, ws)
      this.setCellBorders(`F${row_cols_prepaid_service.number}`, ws)
      this.setCellBorders(`G${row_cols_prepaid_service.number}`, ws)
      this.setCellBorders(`H${row_cols_prepaid_service.number}`, ws)
      this.setCellBorders(`I${row_cols_prepaid_service.number}`, ws)
      this.setCellBorders(`J${row_cols_prepaid_service.number}`, ws)
      this.setCellBorders(`K${row_cols_prepaid_service.number}`, ws)
      this.setCellBackground(`K${row_cols_prepaid_service.number}`, ws)
      for(let item of staff_prepaid_services){
        let tmp_row = ws.addRow([
          item.invoice_date_ts,
          item.client_name,
          item.salary_type,
          item.item_name,
          item.quantity,
          item.sales_amount,
          item.prepaid_card_deduction,
          item.refund_by_prepaid_card,
          item.net_sales,
          item.salary_sales_setting,
          item.salary_for_sales,
        ])
        this.setCellBorders(`A${tmp_row.number}`, ws)
        this.setCellBorders(`B${tmp_row.number}`, ws)
        this.setCellBorders(`C${tmp_row.number}`, ws)
        this.setCellBorders(`D${tmp_row.number}`, ws)
        this.setCellBorders(`E${tmp_row.number}`, ws)
        this.setCellBorders(`F${tmp_row.number}`, ws)
        this.setCellBorders(`G${tmp_row.number}`, ws)
        this.setCellBorders(`H${tmp_row.number}`, ws)
        this.setCellBorders(`I${tmp_row.number}`, ws)
        this.setCellBorders(`J${tmp_row.number}`, ws)
        this.setCellBorders(`K${tmp_row.number}`, ws)
        this.setCellAlignment(`A${tmp_row.number}`, ws)
        this.setCellBackground(`K${tmp_row.number}`, ws)
      }

      const buf = await wb.xlsx.writeBuffer()
      saveAs(new Blob([buf]), `${staff_name}.xlsx`)
    },
    setCellBorders(cell_address, ws){
      ws.getCell(cell_address).border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      }
    },
    setCellAlignment(cell_address, ws){
      ws.getCell(cell_address).alignment = {
        vertical: 'middle',
        horizontal: 'left'
      }
    },
    setCellBackground(cell_address, ws){
      ws.getCell(cell_address).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'FFFFFF00' }
      }
    },

    // format
    formatName(staff_name){
      let tmp_name = staff_name
      if(staff_name == 'TOTAL') tmp_name = this.text_total
      return tmp_name
    },
    formatNumber(number){
      let tmp = ''
      if(number != 0){
        tmp = formatMoney(number,0)
      }
      return tmp
    }
  }
}
</script>

<style lang="scss">
@import './payroll-statement.scss';
</style>
