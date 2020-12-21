<template>
  <main class="app-content">
    <section class="content report-sales-by-repeat-clients-page">
      <div class="page-title">
        <h3>{{ $t('report.sales-by-repeat-clients') }}</h3>
        <ul class="group-btn">
          <li class="btn">{{ $t('general.print') }}</li>
        </ul>
      </div>
      
      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-md-10 filter">
            <div class="row">
              <div class="col-12">
                <input-date-range-by-date-type ref="input_date_range_by_date_type" v-model="table_filter"/>
              </div>
              <div class="col-12">
                <div class="report-by">
                  <label>{{ $t('report.report-by') }}</label>
                  <b-form-select v-model="table_filter.report_by" :options="report_by_options" @input="onInputReportBy"
                                 @mouseleave.native="onMouseLeaveSelect"/>
                </div>
                <div v-if="table_filter.report_by == report_by_enum.prepaid_goods" class="prepaid-goods-type">
                  <b-form-checkbox-group :key="table_filter.prepaid_goods_type_guid"
                                         v-model="table_filter.prepaid_goods_type"
                                         :options="prepaid_goods_type_options"
                                         @input="onInputPrepaidGoodsType"/>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-2">
            <div class="filter-search">
              <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
            </div>
          </div>
        </div>
      </div>

      <div id="table-wrapper" class="table-wrapper">
        <div class="table-repeat-clients">
          <table>
            <thead>
              <tr>
                <th width="30%" rowspan="2">{{ report_by_view_name }}</th>
                <th colspan="2">{{ $t('general.new') }}</th>
                <th colspan="2">{{ $t('report.repeat') }}</th>
                <th v-if="table_filter.report_by_view == report_by_enum.service" colspan="2">{{ $t('report.unregistered') }}</th>
                <th colspan="2">{{ $t('general.total') }}</th>
              </tr>
              <tr>
                <th class="new">{{ $t('general.qty') }}</th>
                <th class="new">{{ $t('general.amount') }}</th>
                <th class="repeat">{{ $t('general.qty') }}</th>
                <th class="repeat">{{ $t('general.amount') }}</th>
                <th v-if="table_filter.report_by_view == report_by_enum.service" class="unregistered">{{ $t('general.qty') }}</th>
                <th v-if="table_filter.report_by_view == report_by_enum.service" class="unregistered">{{ $t('general.amount') }}</th>
                <th class="total">{{ $t('general.qty') }}</th>
                <th class="total">{{ $t('general.amount') }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="table_rows.length == 0">
                <tr>
                  <td colspan="9" class="table-no-data">{{ text_no_data_for_table }}</td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(row, i) in table_rows" :key="i">
                  <td class="key">{{ formatName(row.key) }}</td>
                  <td class="new">{{ getCellValue(row, client_type_enum.new, cell_value_type_enum.qty) }}</td>
                  <td class="new">{{ getCellValue(row, client_type_enum.new, cell_value_type_enum.amount) }}</td>
                  <td class="repeat">{{ getCellValue(row, client_type_enum.repeat, cell_value_type_enum.qty) }}</td>
                  <td class="repeat">{{ getCellValue(row, client_type_enum.repeat, cell_value_type_enum.amount) }}</td>
                  <td v-if="table_filter.report_by_view == report_by_enum.service" class="unregistered">{{ getCellValue(row, client_type_enum.unregistered, cell_value_type_enum.qty) }}</td>
                  <td v-if="table_filter.report_by_view == report_by_enum.service" class="unregistered">{{ getCellValue(row, client_type_enum.unregistered, cell_value_type_enum.amount) }}</td>
                  <td class="total">{{ getCellValue(row, client_type_enum.total, cell_value_type_enum.qty) }}</td>
                  <td class="total">{{ getCellValue(row, client_type_enum.total, cell_value_type_enum.amount) }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
let report_by_enum = {
  service         : 0,
  prepaid_goods   : 1,
  prepaid_service : 2,
  prepaid_card    : 3
}
let client_type_enum = {
  unregistered : 0,
  new          : 1,
  repeat       : 2,
  // total        : 3
}
let cell_value_type_enum = {
  qty   : 'quantity',
  amount: 'amount'
}
// import _ from 'lodash'
import moment from 'moment'
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options.js'
import { sales_options }             from '../../../helpers/options/sales-options.js'
import component_base                from '../../../components/common/component-base/component-base'
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type.vue'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import view_table                    from '../../../components/common/view-table/view-table'
import chart_bar                     from '../../../components/common/chart/chart-bar'
import chart_legend                  from '../../../components/common/chart/chart-legend'
import ReportApi                     from '../../../api/sales/report-api'
import { formatMoney,
  guid,
  convertDateToTimeStamp 
}           from '../../../helpers/common'

export default {
  components: {
    'input-date-range-by-date-type': input_date_range_by_date_type,
    'radio-group': radio_group,
    'view-table' : view_table,
    'chart-bar'  : chart_bar,
    'chart-legend': chart_legend
  },
  extends : component_base,
  data(){
    return {
      options,
      sales_options,
      report_by_enum,
      client_type_enum,
      cell_value_type_enum,

      errors       : [],
      report_api: new ReportApi(),
      
      table_filter: {
        from_date_ts            : 0,
        to_date_ts              : 0,
        report_by_type          : report_by_enum.service,
        shop_id                 : 0,

        // ui only
        date_type               : common_options.date_type.month,
        from_date               : {},
        to_date                 : {},
        report_by               : report_by_enum.service,
        report_by_view          : report_by_enum.service,
        prepaid_goods_type      : [],
        prepaid_goods_type_guid : ''
      },
      table_rows: [],
    }
  },
  computed:{
    report_by_options(){
      return [
        { value: report_by_enum.service,       text: this.$i18n.t('report.service') },
        { value: report_by_enum.prepaid_goods, text: this.$i18n.t('report.prepaid-goods') },
      ]
    },
    prepaid_goods_type_options(){
      return [
        { value: report_by_enum.prepaid_card,    text: this.$i18n.t('report.prepaid-card') },
        { value: report_by_enum.prepaid_service, text: this.$i18n.t('report.prepaid-service') },
      ]
    },
    report_by_view_name(){
      let tmp = ''
      if(this.table_filter.report_by_view == report_by_enum.service)
        tmp = this.$i18n.t('report.service')
      else
        tmp = this.$i18n.t('report.prepaid-goods')
      return tmp
    },
    no_input_text(){return this.$i18n.t('report.no-input')},
    text_total(){ return this.$i18n.t('general.total') },
    text_no_data_for_table(){return this.$i18n.t('general.no-data-for-table')},
    error_prepaid_gooods_need_at_least_one(){return this.$i18n.t('report.error_you_need_select_one_of_the_two_options')},
    error_date_range_can_not_exceed_1_year(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_year')},
  },
  async mounted(){
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.loadTableDataAsync()
  },
  methods:{
    formatMoney,

    // filter
    onInputReportBy(){
      if(this.table_filter.report_by == report_by_enum.service){
        this.table_filter.report_by_type = report_by_enum.service
        this.table_filter.prepaid_goods_type = []
      }
      if(this.table_filter.report_by == report_by_enum.prepaid_goods){
        this.table_filter.report_by_type = report_by_enum.prepaid_goods
        this.table_filter.prepaid_goods_type = [report_by_enum.prepaid_card, report_by_enum.prepaid_service]
      }
    },
    onInputPrepaidGoodsType(value){
      switch(this.table_filter.prepaid_goods_type.length){
        case 0: {
          this.table_filter.report_by_type = report_by_enum.prepaid_goods
          this.table_filter.prepaid_goods_type = []
          break
        }
        case 1:{
          this.table_filter.report_by_type = value[0]
          break
        }
        case 2:{
          this.table_filter.report_by_type = report_by_enum.prepaid_goods
          break
        }
      }
      this.table_filter.prepaid_goods_type_guid = guid()
    },

    // table
    async loadTableDataAsync(){
      if(this.table_filter.date_type == common_options.date_type.date_range){
        let errors = [...this.$refs.input_date_range_by_date_type.errors]
        let tmp_to_date_limit    = moment(new Date(this.table_filter.from_date.value * 1000)).add(1, 'year').toDate()
        let tmp_to_date_limit_ts = convertDateToTimeStamp(tmp_to_date_limit) - 1
        
        if(this.table_filter.to_date.value > tmp_to_date_limit_ts){
          errors.push(this.error_date_range_can_not_exceed_1_year)
        }
        if(errors.length > 0){
          this.showAlert(errors)
          return
        }
      }

      if(this.table_filter.report_by_type == report_by_enum.prepaid_goods && this.table_filter.prepaid_goods_type.length == 0){
        this.showAlert([this.error_prepaid_gooods_need_at_least_one])
        return
      }

      this.preLoader()
      let response = await this.report_api.getSalesByRepeatClientsReportAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        this.table_rows = response.data
        this.table_filter.report_by_view = this.table_filter.report_by
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    onSearch(){
      this.loadTableDataAsync()
    },

    // format
    formatName(name){
      let tmp_name = name
      if(tmp_name == 'TOTAL') tmp_name = this.text_total
      return tmp_name
    },
    getCellValue(row, client_type, cell_value_type){
      let tmp = ''
      let tmp_type = row.types.filter(t => t.item_type == client_type)
      if(tmp_type.length > 0){
        tmp = formatMoney(tmp_type[0][cell_value_type],0)
      }
      return tmp
    }
  }
}
</script>

<style lang="scss">
@import './report-sales-by-repeat-clients.scss';
</style>