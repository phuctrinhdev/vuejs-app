<template>
  <main class="app-content">
    <section class="content expenditure-history-page">
      <div class="page-title">
        <h3>{{ $t('expenditure.expenditure-history') }}</h3>
        <ul class="group-btn">
          <li class="btn btn-add-expenditure"><a @click="onAddExpenditure(options.form_actions.add)">{{ $t('expenditure.add-expenditure') }}</a></li>
          <li class="btn btn-add-item"><router-link :to="{ name: 'expenditure-items' }">{{ $t('expenditure.add-item') }}</router-link></li>
          <!-- <li class="btn btn-print"><a>{{ $t('general.print') }}</a></li> -->
        </ul>
      </div>

      <div class="filter-wrapper">
        <b-form class="row">
          <div class="col-sm-10 filter">
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <input-date-range-by-date-type ref="input_date_range_by_date_type" v-model="table_filter"/>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group item">
                  <label>{{ $t('expenditure.item') }}</label>
                  <b-form-select v-model="table_filter.item_id" 
                                 :options="item_options" value-field="id" text-field="item_name"
                                 @mouseleave.native="onMouseLeaveSelect"/>
                </div>
                <div class="form-group payment">
                  <label>{{ $t('sales.payment') }}</label>
                  <b-form-select v-model="table_filter.payment_id" 
                                 :options="payment_method_options" value-field="id" text-field="name"
                                 @mouseleave.native="onMouseLeaveSelect"/>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-2">
            <div class="filter-search">
              <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
            </div>
          </div>
        </b-form>
      </div>
      
      <div id="table-expenditure-history" class="table table-expenditure-history">
        <div class="table_intro">{{ table_intro }}</div>
        <view-table :data="table_data" @change-page="onChangePage">
          <template slot="date" slot-scope="{row}">
            {{ formatDate(row) }}
          </template>
          <template slot="payment_method_id" slot-scope="{row}">
            {{ formatPaymentMethod(row.payment_method_id) }}
          </template>
          <template slot="amount" slot-scope="{row}">
            {{ formatMoney(row.amount, 0) }}
          </template>
          <template slot="edit" slot-scope="{row}">
            <a class="btn" @click="onEditExpenditure(common_options.form_actions.edit, row)">{{ $t('general.edit') }}</a>
          </template>
        </view-table>
      </div>

      <expenditure-history-add @added="onAddedExpenditureHistory"/>
      <expenditure-history-edit @edited="onEditedExpenditureHistory" @deleted="onDeletedExpenditureHistory"/>
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
import expenditure_item_mixin from '../../../helpers/mixins/expenditure-items-mixin'
import payment_method_mixin from '../../../helpers/mixins/payment-method-mixin'
import expenditure_history_add       from '../../../components/expenditure/expenditure-action/expenditure-history-add'
import expenditure_history_edit       from '../../../components/expenditure/expenditure-action/expenditure-history-edit'
import component_base        from '../../../components/common/component-base/component-base.vue'
import view_table            from '../../../components/common/view-table/view-table.vue'
import ExpenditureHistoryApi           from '../../../api/expenditure/expenditure-history-api'
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type.vue'
import ExpenditureHistoryViewModel from '../../../view-model/expenditure/expenditure-history-view-model'
import { 
  formatMoney,
  convertTimeStampToDate,
  convertDateToTimeStamp,
  convertTimeStampMinusLocalzone,
} from '../../../helpers/common'

export default {
  components : {
    'input-date-range-by-date-type': input_date_range_by_date_type,
    'expenditure-history-add': expenditure_history_add,
    'expenditure-history-edit': expenditure_history_edit,
    'v-date-picker'   : DatePicker,
    'view-table'      : view_table
  },
  extends : component_base,
  mixins: [expenditure_item_mixin, payment_method_mixin],
  data(){
    return {
      options,
      common_options,

      expenditure_history_api: new ExpenditureHistoryApi(),

      table_total_amount: 0,
      table_data   : {
        fields : [
          {field: 'date',               label: 'general.date',          width: '15%',   sortable: false, expand: true },
          {field: 'item_name',          label: 'expenditure.items',     width: '20%',   sortable: false },
          {field: 'payment_method_id',  label: 'sales.payment-method',  width: '15%',   sortable: false, expand: true },
          {field: 'amount',             label: 'sales.amount',          width: '20%',   sortable: false, expand: true },
          {field: 'notes',              label: 'general.notes',         width: '25%',   sortable: false },
          {field: 'edit',               label: 'general.edit',          width: '5%',    sortable: false, expand: true}
        ],
        rows   : [],
        pagination : { total_pages: 1 },
        options : { pagination: true }
      },
      table_filter      : {
        from_date_ts     : 0,
        to_date_ts       : 0,
        item_id          : 0,
        payment_id       : 0,
        keywords         : '',
        page_size        : common_options.pagination.default,
        page_number      : 1,
        shop_id          : 0,

        // only ui
        date_type        : common_options.date_type.month,
        from_date        : {},
        to_date          : {},
      },

      item_options: [],
      payment_method_options: []
    }
  },
  computed:{
    ...mapGetters('expenditure_history',{
      x_expenditure_history : 'getExpenditureHistory'
    }),
    table_intro(){
      let text = this.$i18n.t('expenditure.total-expenditure')
      let number = formatMoney(this.table_total_amount,0)
      return `${text}: ${number}`
    },
    text_all(){ return this.$i18n.t('general.all') },
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

    this.preLoader()
    await this.loadExpenditureItemsAsync()
    await this.loadPaymentMethodsAsync()
    await this.onLoadTableData()
    this.preLoader(false)
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

    // filter
    async loadExpenditureItemsAsync(){
      let tmp_all_option = { id: 0, item_name: this.text_all}

      let response = await this.getExpenditureItemsAsyncMixin()
      if(response.is_ok){
        this.setExpenditureItems(response.data)
        this.item_options = [tmp_all_option, ...response.data]
        this.table_filter.item_id = tmp_all_option.id
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    async loadPaymentMethodsAsync(){
      let tmp_all_option = { id: 0, name: this.text_all}

      let response = await this.getPaymentMethodsAsyncMixin(options.good_status.all)
      if(response.is_ok){
        this.setPaymentMethods(response.data)
        this.payment_method_options = [tmp_all_option, ...response.data.items]
        this.table_filter.payment_id = tmp_all_option.id
      }
      else {
        this.showAlert(response.error_messages)
      }
    },

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

      this.preLoader()
      let response = await this.expenditure_history_api.getExpenditureHistoryAsync(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        this.setExpenditureHistory(response.data)
        this.table_total_amount    = this.x_expenditure_history.total_amount
        this.table_data.rows       = this.x_expenditure_history.items
        this.table_data.pagination = this.x_expenditure_history.pagination
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    onSearch(){
      this.table_filter.page_number = 1
      this.onLoadTableData()
    },
    onChangePage(page_number){
      this.table_filter.page_number = page_number
      this.onLoadTableData()
    },

    // add
    onAddExpenditure(action){
      let expenditure_history_add = {
        action: action,
        data: new ExpenditureHistoryViewModel().fields
      }
      this.setExpenditureHistoryAdd(expenditure_history_add)
      this.showDialogById('expenditure-history-add-modal')
    },
    onAddedExpenditureHistory(){
      this.onLoadTableData()
    },

    // edit
    onEditExpenditure(action, expenditure_history){
      let expenditure_history_edit = {
        action: action,
        data: expenditure_history
      }
      this.setExpenditureHistoryEdit(expenditure_history_edit)
      this.showDialogById('expenditure-history-edit-modal')
    },
    onEditedExpenditureHistory(){
      this.onLoadTableData()
    },

    // delete
    onDeletedExpenditureHistory(){
      this.onLoadTableData()
    },

    // format
    formatDate(row){
      let tmp_date = convertTimeStampToDate(convertTimeStampMinusLocalzone(row.expenditure_date_ts))
      return moment(tmp_date).format(common_options.standard_date_format.ymd)
    },
    formatPaymentMethod(payment_method_id){
      let tmp_payment_name = ''
      let tmp_payments = this.payment_method_options.filter(p => p.id == payment_method_id)
      if(tmp_payments.length > 0){
        tmp_payment_name = tmp_payments[0].name
      }
      return tmp_payment_name
    }
  }
}
</script>

<style lang="scss">
@import './expenditure-history.scss';
</style>