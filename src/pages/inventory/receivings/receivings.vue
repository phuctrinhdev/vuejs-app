
<template>
  <main class="app-content">
    <section class="content receivings-page">
      <!-- BEGIN TITLE -->
      <div class="title">
        <div class="row">
          <div class="col-6"><h3>{{ $t('receivings.title') }}</h3></div>
          <div class="col-6"><a id="btnAddReceiving" @click="onReceivingAction">{{ $t('receivings.add-receiving') }}</a></div>
        </div>
      </div>

      <!-- BEGIN FILTER -->
      <div class="filter">
        <div class="row">
          <div class="col-sm-9 col-lg-10">
            <div class="filter-fields">
              <input-date-range ref="input_date_range" @input="onInputDate"/>
              <div class="supplier">
                <label>{{ $t('receivings.supplier') }}</label>
                <b-form-select id="ddlSuppliers" v-model="table_filter.supplier_id"
                               :options="suppliers_options"
                               value-field="supplier_id"
                               text-field="supplier_name"
                               @mouseleave.native="onMouseLeaveSelect">
                  <template v-slot:first>
                    <option :value="DEFAULT_GET_ALL_SUPPLIERS">{{ $t('general.all') }}</option>
                  </template>
                </b-form-select>
              </div>
            </div>
          </div>
          <div class="col-sm-3 col-lg-2">
            <div class="search">
              <button class="btn-submit" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
            </div>
          </div>
        </div>
      </div>

      <!-- BEGIN TABLE -->
      <div class="table">
        <p>{{ total_records_amount_text }}</p>
        <view-table :data="table_data" @change-page="onChangePage">
          <template slot="view" slot-scope="{row}">
            <a class="btn" @click="onReceivingDetailAction(row,common_options.form_actions.view)">{{ $t('general.view') }}</a>
          </template>
          <template slot="receiving_date_ts" slot-scope="{row}">
            {{ moment(convertTimeStampToUtcDate(row.receiving_date_ts)).format(common_options.standard_date_format.ymd) }}
          </template>
          <template slot="quantity" slot-scope="{row}">
            {{ formatMoney(row.quantity,0) }}
          </template>
          <template slot="amount" slot-scope="{row}">
            {{ formatMoney(row.amount,0) }}
          </template>
        </view-table>
      </div>
    </section>
    <receiving-detail-action @deleted-receiving="onDeletedReceiving"/>
    <receiving-action @added-receiving="onAddedReceiving"/>
  </main>
</template>

<script>
const DEFAULT_GET_ALL_SUPPLIERS = 0
import moment                   from 'moment'
import ReceivingViewModel       from '../../../view-model/inventory/receivings/receiving-view-model.js'
import ReceivingApi             from '../../../api/inventory/receiving-api.js'
import component_base           from '../../../components/common/component-base/component-base.vue'
import view_table               from '../../../components/common/view-table/view-table.vue'
import receiving_detail_action  from '../../../components/inventory/receivings/receiving-detail-action/receiving-detail-action.vue'
import receiving_action         from '../../../components/inventory/receivings/receiving-action/receiving-action.vue'
import supplier_mixin           from '../../../helpers/mixins/supplier-mixin.js'
import input_date_range         from '../../../components/common/form/input/input-date-range/input-date-range.vue'

import { common_options }                       from '../../../helpers/options/common-options.js'
import { inventory_options }                    from '../../../helpers/options/inventory-options.js'
import { mapMutations, mapGetters }             from 'vuex'
import { convertTimeStampToUtcDate,
  formatMoney,
  convertDateToTimeStamp,
  guid }   from '../../../helpers/common.js'

export default {
  components : {
    'view-table'             : view_table,
    'receiving-detail-action': receiving_detail_action,
    'receiving-action'       : receiving_action,
    'input-date-range'       : input_date_range
  },
  extends : component_base,
  mixins  : [supplier_mixin],
  data(){
    return{
      moment,
      common_options,
      inventory_options,
      DEFAULT_GET_ALL_SUPPLIERS,
      receiving_api     : new ReceivingApi(),
      suppliers_options : [],
      table_filter:{
        supplier_id  : DEFAULT_GET_ALL_SUPPLIERS,
        date_from_ts : 0,
        date_to_ts   : 0,
        keywords     : '',
        page_size    : common_options.pagination.default,
        page_number  : 1,
        shop_id      : 0
      },
      total_records : 0,
      total_amount  : 0,

      key: guid()
    }
  },
  computed:{
    ...mapGetters('receiving',{
      x_receivings              : 'getReceivings',
      x_receiving_action        : 'getReceivingAction',
      x_total_amount_receivings : 'getTotalAmountOfReceivings'
    }),
    table_data(){
      return {
        fields : [
          {field: 'receiving_date_ts',     label: 'receivings.receiving-date',   width: '20%',   sortable: false, expand: true},
          {field: 'supplier_name',         label: 'receivings.supplier',         width: '20%',   sortable: false },
          {field: 'quantity',              label: 'receivings.quantity',         width: '10%',   sortable: false, expand: true },
          {field: 'amount',                label: 'receivings.amount',           width: '10%',   sortable: false, expand: true },
          {field: 'notes',                 label: 'receivings.notes',            width: '30%',   sortable: false },
          {field: 'view',                  label: 'receivings.details',          width: '10%',   sortable: false, expand: true}
        ],
        rows       : this.x_receivings.items,
        pagination : this.x_receivings.pagination,
        options    : {
          // fixed_header: true,
          pagination : true
        }
      }
    },
    total_records_amount_text(){
      let text = this.$i18n.t('receivings.total-records-amount')
      text = text.replace('{records}',formatMoney(this.total_records,0))
      text = text.replace('{total_amount}',formatMoney(this.x_total_amount_receivings,0))
      return text
    }
  },
  async created(){
    this.table_filter.shop_id = this.shop_data.shop_id
    this.suppliers_options    = await this.getSuppliersOptionMixinAsync()
  },
  async mounted(){ // not created because input_date_range need render first
    await this.loadDataTableAsync()
  },
  methods:{
    ...mapMutations('receiving',[
      'setReceivings',
      'setReceivingAction'
    ]),
    convertTimeStampToUtcDate,
    convertDateToTimeStamp,
    formatMoney,

    async loadDataTableAsync(){
      if(this.$refs.input_date_range.errors.length > 0){
        this.showAlert([...this.$refs.input_date_range.errors] )
        return
      }

      this.preLoader()
      let response = await this.receiving_api.getReceivingsAsync(this.table_filter)
      this.preLoader(false)
      if (response.is_ok){
        this.setReceivings(response.data)
        this.total_amount  = response.data.receiving_summary.total_amount
        this.total_records = response.data.pagination.total_items
      }else{
        this.showAlertDialog(response.error_messages)
      }
    },
    async onSearch(){
      this.table_filter.page_number = 1
      await this.loadDataTableAsync()
    },
    async onChangePage(page_number){
      this.table_filter.page_number = page_number
      await this.loadDataTableAsync()
    },

    onReceivingDetailAction(receiving = new ReceivingViewModel(),action){
      this.setReceivingAction({action : action,data : receiving})
      this.showDialogById('receiving-detail-action-modal')
    },
    onReceivingAction(){
      let receiving_action = {
        action : common_options.form_actions.add,
        data   : new ReceivingViewModel()
      }
      this.setReceivingAction(receiving_action)
      this.showDialogById('receiving-action-modal')
    },
    onDeletedReceiving(){
      this.onSearch()
    },
    onAddedReceiving() {
      this.onSearch()
    },
    onInputDate(data){
      this.table_filter.date_from_ts = data.value.from_date.value
      this.table_filter.date_to_ts   = data.value.to_date.value
    },
  }
}
</script>

<style lang="scss">
@import './receivings.scss';
</style>
