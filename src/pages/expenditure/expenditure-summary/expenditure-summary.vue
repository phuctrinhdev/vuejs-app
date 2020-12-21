<template>
  <main class="app-content">
    <section class="content expenditure-summary-page">
      <div class="page-title">
        <h3>{{ $t('expenditure.expenditure-summary') }}</h3>
        <ul class="group-btn">
          <li class="btn"><a>{{ $t('general.print') }}</a></li>
        </ul>
      </div>

      <div class="filter-wrapper">
        <b-form class="row">
          <div class="col-9 col-sm-12 col-md-9">
            <input-date-range-by-date-type ref="input_date_range_by_date_type" v-model="table_filter"/>
          </div>
          <div class="col-3 col-sm-12 col-md-3">
            <div class="filter-search">
              <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
            </div>
          </div>
        </b-form>
      </div>
      
      <div id="table-expenditure-summary" class="table table-expenditure-summary">
        <view-table :data="table_data">
          <template slot="total_records" slot-scope="{row}">
            {{ formatMoney(row.total_records, 0) }}
          </template>
          <template slot="total_amount" slot-scope="{row}">
            {{ formatMoney(row.total_amount, 0) }}
          </template>
        </view-table>
      </div>
    </section>
  </main>
</template>

<script>
// import _ from 'lodash'
import moment from 'moment'
import { mapMutations, mapGetters }   from 'vuex'
import { common_options }    from '../../../helpers/options/common-options.js'
import { options } from '../../../helpers/options'
import { DatePicker, setupCalendar }       from 'v-calendar'
import component_base        from '../../../components/common/component-base/component-base.vue'
import view_table            from '../../../components/common/view-table/view-table.vue'
import ExpenditureSummaryApi           from '../../../api/expenditure/expenditure-summary-api'
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type.vue'
// import ExpenditureHistoryViewModel from '../../../view-model/expenditure/expenditure-history-view-model'
import { 
  formatMoney, 
  // convertDateToTimezone,
  convertDateToTimeStamp
} from '../../../helpers/common'

export default {
  components : {
    'input-date-range-by-date-type': input_date_range_by_date_type,
    'v-date-picker'   : DatePicker,
    'view-table'      : view_table
  },
  extends : component_base,
  data(){
    return {
      options,
      common_options,

      expenditure_summary_api: new ExpenditureSummaryApi(),

      table_total_amount: 0,
      table_data   : {
        fields : [
          {field: 'item_name',      label: 'expenditure.items',           width: '45%',   sortable: false },
          {field: 'total_records',  label: 'expenditure.number-records',  width: '25%',   sortable: false, expand: true },
          {field: 'total_amount',   label: 'sales.amount',                width: '30%',   sortable: false, expand: true }
        ],
        rows   : [],
        pagination : { total_pages: 1 },
        options : { pagination: false }
      },
      table_filter      : {
        date_from_ts     : 0,
        date_to_ts       : 0,
        shop_id          : 0,

        // ui only
        date_type        : common_options.date_type.month,
        from_date        : {},
        to_date          : {},
      },
    }
  },
  computed:{
    ...mapGetters('expenditure_history',{
      x_expenditure_history : 'getExpenditureHistory'
    }),
    end_date_can_not_before_start_date(){return this.$i18n.t('input-date-range.end-date-can-not-before-start-date')},
    error_date_range_can_not_exceed_1_year(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_year')},
  },
  async created(){
    // filter
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db',
    })
  },
  async mounted(){
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.onLoadTableData()
  },

  methods:{
    ...mapMutations('expenditure_history',[
      'setExpenditureHistory',
      'setExpenditureHistoryAdd',
      'setExpenditureHistoryEdit'
    ]),
    ...mapMutations('expenditure_item',[
      'setExpenditureItems'
    ]),
    ...mapMutations('payment_method',[
      'setPaymentMethods'
    ]),
    moment,
    formatMoney,
    // table
    async onLoadTableData(){
      let errors = []
      let tmp_to_date_limit    = moment(new Date(this.table_filter.from_date_ts * 1000)).add(1, 'year').toDate()
      let tmp_to_date_limit_ts = convertDateToTimeStamp(tmp_to_date_limit) - 1
      
      if(this.table_filter.from_date_ts > this.table_filter.to_date_ts){
        errors.push(this.end_date_can_not_before_start_date)
      }
      if(this.table_filter.to_date_ts > tmp_to_date_limit_ts){
        errors.push(this.error_date_range_can_not_exceed_1_year)
      }
      if(errors.length > 0){
        this.showAlert(errors)
        return
      }

      this.table_filter.from_date_ts = this.table_filter.from_date.value
      this.table_filter.to_date_ts   = this.table_filter.to_date.value

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

      this.preLoader()
      let response = await this.expenditure_summary_api.getExpenditureSummaryAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        this.table_data.rows = response.data
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    onSearch(){
      this.onLoadTableData()
    },
  }
}
</script>

<style lang="scss">
@import './expenditure-summary.scss';
</style>