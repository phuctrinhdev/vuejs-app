<template>
  <main class="app-content">
    <section class="content stock-internal-use-page">
      <div class="page-title">
        <h3>{{ $t('stock-internal-use.stock-internal-use') }}</h3>
        <ul class="group-btn">
          <li class="btn"><router-link id="btn-add-internal-use" :to="{ name: 'add-internal-use' }">{{ $t('stock-internal-use.add-internal-use') }}</router-link></li>
          <!-- <li class="btn"><a>{{ $t('stock-internal-use.print') }}</a></li> -->
        </ul>
      </div>

      <div class="filter-wrapper">
        <b-form class="row">
          <div class="col-sm-10 filter">
            <div class="row">
              <div class="col-md-7 col-xl-6 form-group date-range">
                <label>{{ $t('stock-internal-use.date-range') }}</label>
                <v-date-picker
                  id="stock-internal-use-from-date"
                  v-model="table_filter.date_from" 
                  :popover="{ placement: 'bottom' }"
                  :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                  @input="onInputDateFrom"/>
                <v-date-picker
                  id="stock-internal-use-to-date"
                  v-model="table_filter.date_to" 
                  :popover="{ placement: 'bottom' }"
                  :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                  @input="onInputDateTo"/>
              </div>
              <div class="col-md-5 col-xl-6 form-group product">
                <label>{{ $t('products.product') }}</label>
                <b-form-input id="stock-internal-use-product-code" v-model="table_filter.key_words" :placeholder="product_placeholder"
                              type="text"/>
              </div>
              <div class="col-md-7 col-xl-6 form-group category">
                <label>{{ $t('products.category') }}</label>
                <b-form-select id="stock-internal-use-category-id" v-model="table_filter.category_id" 
                               :options="category_options" value-field="id" text-field="name"
                               @mouseleave.native="onMouseLeaveSelect"/>
              </div>
              <div class="col-md-5 col-xl-6 form-group staff">
                <label>{{ $t('sales-invoice-tab.staff') }}</label>
                <b-form-select id="stock-internal-use-staff-id" v-model="table_filter.staff_id"
                               :options="staff_options" value-field="id" text-field="aliasname"
                               @mouseleave.native="onMouseLeaveSelect"/>
              </div>
            </div>
          </div>
          <div class="col-sm-2 filter-search">
            <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
          </div>
        </b-form>
      </div>
      
      <div id="table-stock-internal-uses" class="table table-stock-internal-uses">
        <div class="table_intro">{{ table_intro }}</div>
        <view-table :data="table_data" @change-page="onChangePage">
          <template slot="using_date" slot-scope="{row}">
            {{ moment(row.using_date).format(common_options.standard_date_format.ymd) }}
          </template>
          <template slot="unit_price" slot-scope="{row}">
            {{ formatMoney(row.unit_price, 0) }}
          </template>
          <template slot="qty" slot-scope="{row}">
            {{ formatMoney(row.qty, 0) }}
          </template>
          <template slot="amount" slot-scope="{row}">
            {{ formatMoney(row.amount, 0) }}
          </template>
          <template slot="edit" slot-scope="{row}">
            <a class="btn" @click="onActionAddInternalUse(common_options.form_actions.edit, row.fields)">{{ $t('general.edit') }}</a>
          </template>
        </view-table>
      </div>

      <stock-internal-use-action @edited="onEditedStockInternalUse" @deleted="onDeletedStockInternalUse"/>
    </section>
  </main>
</template>

<script>
// import _ from 'lodash'
import moment from 'moment'
import { mapMutations, mapGetters }   from 'vuex'
import { common_options }    from '../../../helpers/options/common-options.js'
import { inventory_options } from '../../../helpers/options/inventory-options.js'
import { DatePicker, setupCalendar }       from 'v-calendar'
import product_category_mixin from '../../../helpers/mixins/product-category-mixin'
import staff_mixin from '../../../helpers/mixins/staff-mixin'
import stock_internal_use_action       from '../../../components/inventory/stock-internal-use/stock-internal-use-action.vue'
import component_base        from '../../../components/common/component-base/component-base.vue'
import view_table            from '../../../components/common/view-table/view-table.vue'
import StockInternalUseApi           from '../../../api/inventory/stock-internal-use-api'
// import StockInternalUseViewModel     from '../../../view-model/inventory/stock-internal-use/stock-internal-use-view-model'
import { convertDateToTimezone,
  formatMoney, 
  convertDateToTimeStamp,
} from '../../../helpers/common'

export default {
  components : {
    'stock-internal-use-action': stock_internal_use_action,
    'v-date-picker'   : DatePicker,
    'view-table'      : view_table
  },
  extends : component_base,
  mixins: [product_category_mixin, staff_mixin],
  data(){
    return {
      common_options,
      inventory_options,

      stock_internal_use_api: new StockInternalUseApi(),

      table_data   : {
        fields : [
          {field: 'using_date',    label: 'general.date',          width: '10%',   sortable: false, expand: true },
          {field: 'staff_name',    label: 'general.staff',         width: '10%',   sortable: false },
          {field: 'product_code',  label: 'products.product-code', width: '10%',   sortable: false },
          {field: 'product_name',  label: 'products.product-name', width: '20%',   sortable: false },
          {field: 'unit_price',    label: 'general.unit-price',    width: '10%',   sortable: false, expand: true },
          {field: 'qty',           label: 'general.qty',           width: '5%',    sortable: false, expand: true },
          {field: 'amount',        label: 'general.amount',        width: '10%',   sortable: false, expand: true },
          {field: 'notes',         label: 'general.notes',         width: '20%',   sortable: false },
          {field: 'edit',          label: 'general.edit',          width: '5%',    sortable: false, expand: true}
        ],
        rows   : [],
        pagination : { total_pages: 1 },
        options : { pagination: true }
      },
      table_filter: {
        date_from   : convertDateToTimezone(moment().date(1).toDate()),
        date_from_ts: 0,
        date_to     : convertDateToTimezone(new Date()),
        date_to_ts  : 0,
        key_words   : '',
        category_id : 0,
        staff_id    : 0,
        page_size   : common_options.pagination.big,
        page_number : 1,
        shop_id     : 0
      },

      category_options: [],
      staff_options: [],
    }
  },
  computed:{
    ...mapGetters('stock_internal_use',{
      x_stock_internal_uses : 'getStockInternalUses'
    }),
    table_intro(){
      let tmp = this.$i18n.t('sales-invoice-tab.all')
      tmp = tmp.replace('{0}', formatMoney(this.table_data.pagination.total_items,0))
      tmp = tmp.replace('{1}', formatMoney(this.x_stock_internal_uses.total_amount, 0))
      return tmp
    },
    product_placeholder(){ return this.$i18n.t('stock-internal-use.product-code-or-name') },
    text_all(){ return this.$i18n.t('general.all') }
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
    await this.loadProductCategoryOptionsAsync()
    await this.loadStaffOptionsAsync()

    // load table-data
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.onLoadTableData()
  },

  methods:{
    ...mapMutations('stock_internal_use',[
      'setStockInternalUses',
      'setStockInternalUseAction'
    ]),
    ...mapMutations('staff',[
      'setStaffOptions',
    ]),
    moment,
    formatMoney,

    async loadProductCategoryOptionsAsync(){
      let tmp_all_option = { id: 0, name: this.text_all}
      let response = await this.getProductCategorysAsyncMixin()

      if(response.is_ok){
        this.category_options = [tmp_all_option, ...response.data.items]
        this.table_filter.category_id = tmp_all_option.id
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    async loadStaffOptionsAsync(){
      let tmp_all_option = { id: 0, aliasname: this.text_all}
      let response = await this.getStaffsAsyncMixin()

      if(response.is_ok){
        this.setStaffOptions(response.data.items)
        this.staff_options = [tmp_all_option, ...response.data.items]
        this.table_filter.staff_id = tmp_all_option.id
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    async onLoadTableData(){
      this.table_filter.date_from_ts = convertDateToTimeStamp(this.table_filter.date_from, false, true)
      this.table_filter.date_to_ts   = convertDateToTimeStamp(moment(this.table_filter.date_to).endOf('day').toDate(),false,true)
      this.table_filter.date_to_ts  -= 1
      
      this.preLoader()
      let response = await this.stock_internal_use_api.getStockInternalUsesAsync(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        this.setStockInternalUses(response.data)
        this.table_data.rows       = this.x_stock_internal_uses.items
        this.table_data.pagination = this.x_stock_internal_uses.pagination
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

    // filter
    onInputDateFrom(date){
      if(date == null)
        this.table_filter.date_from = moment(convertDateToTimezone(new Date())).date(1).toDate()
    },
    onInputDateTo(date){
      if(date == null)
        this.table_filter.date_to = convertDateToTimezone(new Date())
    },

    // action
    onActionAddInternalUse(action, stock_internal_use){
      let stock_internal_use_action = {
        action : action,
        data   : stock_internal_use
      }
      this.setStockInternalUseAction(stock_internal_use_action)
      this.showDialogById('stock-internal-use-action-modal')
    },
    onEditedStockInternalUse(){
      this.onLoadTableData()
    },
    onDeletedStockInternalUse(){
      this.onLoadTableData()
    },
  }
}
</script>

<style lang="scss">
@import './stock-internal-use.scss';
</style>